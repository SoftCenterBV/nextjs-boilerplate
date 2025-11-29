'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

import { patchAsJson, postAsJson } from '../client';
import type { ApiError, UserData } from '../types'; // Import UserData

/**
 * Type for login request
 */
export type LoginRequest = {
    email: string;
    password: string;
    returnTo?: string;
};

/**
 * Type for register request
 */
export type RegisterRequest = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    language: string;
    password_confirmation: string;
};

/**
 * Validates if a URL is safe for redirecting
 * Only allows internal URLs that start with / and don't contain protocol/domain
 */
export async function isValidReturnUrl(url: string | null | undefined): Promise<boolean> {
    if (!url) {
        return false;
    }
    return url.startsWith('/') && !url.includes('://');
}

/**
 * Type for the successful login response containing the token.
 */
export type LoginSuccessResponse = {
    message: string;
    token: string;
    user: UserData;
};

/**
 * Type for the response indicating 2FA is required.
 */
export type Login2FARequiredResponse = {
    two_factor: boolean;
    message: string;
    login_token: string;
    two_factor_login_route: string;
};

/**
 * Combined type for possible successful responses from /auth/login.
 */
export type LoginApiResponse = LoginSuccessResponse | Login2FARequiredResponse;

/**
 * Type for logout response
 */
export type LogoutResponse = {
    message: string;
};

/**
 * Type for send password reset link request
 */
export type SendPasswordResetLinkRequest = {
    email: string;
    url: string;
};

/**
 * Type for send password reset link response
 */
export type SendPasswordResetLinkResponse = {
    message: string;
};

/**
 * Type for reset password request
 */
export type ResetPasswordRequest = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

/**
 * Type for reset password response
 */
export type ResetPasswordResponse = {
    message: string;
};

/**
 * Type for update password request
 */
export type UpdatePasswordRequest = {
    current_password: string;
    password: string;
    password_confirmation: string;
    logout_all_devices?: boolean;
    two_factor_auth_code?: string;
};

/**
 * Type for update password response
 */
export type UpdatePasswordResponse = {
    message: string;
};

/**
 * Type for the successful register response.
 */
export type RegisterSuccessResponse = {
    message: string;
    token: string;
    user: UserData;
};

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<
    | { success: true; twoFactorRequired: false; redirectUrl: string; data: LoginSuccessResponse }
    | { success: true; twoFactorRequired: true; loginToken: string; twoFactorLoginRoute: string } // Updated to include login token
    | { success: false; error: ApiError }
> {
    console.log('Attempting login with credentials:', credentials);
    return Sentry.withServerActionInstrumentation(
        'auth.login',
        { recordResponse: true },
        async () => {
            const { returnTo, ...loginCredentials } = credentials;

            try {
                // Try to login with the new API endpoint
                const response = await postAsJson<LoginApiResponse>('/auth/login', loginCredentials);
                console.log('Login response:', response);

                // Check if 2FA is required
                if ('two_factor' in response && response.two_factor === true) {
                    // Return a specific success state indicating 2FA is needed with the login token
                    return {
                        success: true as const,
                        twoFactorRequired: true as const,
                        loginToken: response.login_token,
                        twoFactorLoginRoute: response.two_factor_login_route,
                    };
                }

                // If we get here, login was successful and returned a token
                if ('token' in response) {
                    const cookieStore = await cookies();
                    const sessionCookieName = process.env.SESSION_COOKIE || 'session';
                    const userIdCookieName = process.env.USER_ID_COOKIE || 'user_id'; // Define cookie name for user ID

                    const cookieOptions = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'lax' as const, // Use 'lax' or 'strict'
                    };

                    // Set session token cookie
                    cookieStore.set(sessionCookieName, response.token, cookieOptions);

                    // Set user ID cookie - Store only the ID string
                    if (response.user && response.user.id) {
                        cookieStore.set(userIdCookieName, response.user.id, cookieOptions);
                    } else {
                        return {
                            success: false as const,
                            error: {
                                status: 500, // Internal server error conceptually
                                code: 'LOGIN_RESPONSE_INVALID',
                                message: 'Login succeeded but response data was incomplete.',
                                messageKey: 'auth.login.invalidResponse',
                            },
                        };
                    }

                    // Revalidate auth-dependent paths
                    revalidatePath('/', 'layout'); // Revalidate root layout which likely has auth state

                    // Determine redirect URL
                    const redirectUrl = (await isValidReturnUrl(returnTo)) ? (returnTo as string) : '/';

                    // Return success with token and redirect URL
                    return {
                        success: true as const,
                        twoFactorRequired: false as const,
                        redirectUrl,
                        data: response,
                    };
                }

                return {
                    success: false as const,
                    error: {
                        status: 500,
                        code: 'LOGIN_RESPONSE_UNEXPECTED',
                        message: 'Received an unexpected response structure after login.',
                        messageKey: 'auth.login.unexpectedResponse',
                    },
                };
            } catch (error: any) {
                // Handle API call errors (network, 4xx, 5xx)
                if (error.response) {
                    const { status } = error.response;

                    //log status and response data for debugging
                    console.log('Login error response status:', status);
                    console.log('Login error response data:', error);



                    // Map HTTP status codes to error types
                    let messageKey = 'auth.login.unknownError';
                    let code = 'UNKNOWN_ERROR';

                    if (status === 401) {
                        // Unauthorized - Invalid credentials
                        messageKey = 'auth.login.invalidCredentials';
                        code = 'INVALID_CREDENTIALS';
                    } else if (status === 403) {
                        // Forbidden - Account locked or disabled
                        messageKey = 'auth.login.accountLocked';
                        code = 'ACCOUNT_LOCKED';
                    } else if (status >= 500) {
                        // Server error
                        messageKey = 'auth.login.serverError';
                        code = 'SERVER_ERROR';
                    }

                    const apiError: ApiError = {
                        status,
                        code,
                        message: error.response.data?.message || 'Login failed',
                        messageKey,
                    };

                    // Return an error result instead of throwing
                    return {
                        success: false as const,
                        error: apiError,
                    };
                }

                // Generic error handling in case of unexpected errors.
                const apiError: ApiError = {
                    status: 500,
                    code: 'UNKNOWN_ERROR',
                    message: error.message || 'Unknown error occurred',
                    messageKey: 'auth.login.unknownError',
                };

                return {
                    success: false as const,
                    error: apiError,
                };
            }
        }
    );
}

/**
 * Register a new user.
 * Note: Based on the new API, successful registration returns user data AND logs the user in.
 */
export async function register(
    credentials: RegisterRequest
): Promise<
    | { success: true; data: RegisterSuccessResponse; redirectUrl: string }
    | { success: false; error: ApiError }
> {
    return Sentry.withServerActionInstrumentation(
        'auth.register',
        { recordResponse: true },
        async () => {
            try {
                // Call the register endpoint with the new API path
                const response = await postAsJson<RegisterSuccessResponse>('/auth/register', credentials);

                // Check if the response contains the expected structure for a successful registration
                if (response && response.token && response.user) {
                    // Set cookies since the user is now logged in
                    const cookieStore = await cookies();
                    const sessionCookieName = process.env.SESSION_COOKIE || 'session';
                    const userIdCookieName = process.env.USER_ID_COOKIE || 'user_id';

                    const cookieOptions = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'lax' as const,
                    };

                    // Set session token cookie
                    cookieStore.set(sessionCookieName, response.token, cookieOptions);

                    // Set user ID cookie
                    if (response.user.id) {
                        cookieStore.set(userIdCookieName, response.user.id, cookieOptions);
                    }

                    // Revalidate auth-dependent paths
                    revalidatePath('/', 'layout');

                    return {
                        success: true as const,
                        data: response,
                        redirectUrl: '/', // Redirect to home page after successful registration
                    };
                }

                // If the response structure is not as expected for success
                return {
                    success: false as const,
                    error: {
                        status: 500, // Internal server error conceptually
                        code: 'LOGIN_RESPONSE_INVALID',
                        message: 'Login succeeded but response data was incomplete.',
                        messageKey: 'auth.login.invalidResponse',
                    },
                };
            } catch (error: any) {
                // Handle API call errors (network, 4xx, 5xx)
                if (error.response) {
                    const { status } = error.response;
                    // eslint-disable-next-line no-underscore-dangle
                    const responseData = error.response._data || {};

                    // Map HTTP status codes to error types
                    const messageKey = responseData.message?.replaceAll(' ', '.') ?? null;
                    const code = 'UNKNOWN_ERROR';
                    const message = responseData.message || 'Registration failed'; // Default message

                    // Return an error result
                    return {
                        success: false as const,
                        error: {
                            status,
                            code,
                            message,
                            messageKey,
                        },
                    };
                }

                // Generic error handling for unexpected errors
                const apiError: ApiError = {
                    status: 500,
                    code: 'UNKNOWN_ERROR',
                    message: error.message || 'Unknown error occurred during registration',
                    messageKey: 'auth.register.unknownError',
                };

                return {
                    success: false as const,
                    error: apiError,
                };
            }
        }
    );
}

/**
 * Logout the current user
 * @returns A result object that can be either a success or an error
 */
export async function logout(): Promise<
    { success: true; redirectUrl: string; data: LogoutResponse } | { success: false; error: ApiError }
> {
    try {
        let response = { message: 'logged out' } as LogoutResponse;

        try {
            response = await postAsJson<LogoutResponse>('/auth/logout');
        } catch (error: any) {
            // If the logout endpoint fails, we still want to clear cookies
        }

        // Then clear session cookie AND user ID cookie
        const cookieStore = await cookies();
        cookieStore.delete(process.env.SESSION_COOKIE || 'session');
        cookieStore.delete(process.env.USER_ID_COOKIE || 'user_id'); // Also delete user ID cookie

        // Revalidate auth-dependent paths
        revalidatePath('/', 'layout');

        // Return success with the redirect URL
        return {
            success: true,
            redirectUrl: '/en/login',
            data: response,
        };
    } catch (error: any) {
        // Generic error handling
        const apiError: ApiError = {
            status: 500,
            code: 'UNKNOWN_ERROR',
            message: 'Unknown error occurred',
            messageKey: 'auth.logout.unknownError',
        };

        // Return an error result instead of throwing
        return {
            success: false as const,
            error: apiError,
        };
    }
}

/**
 * Send password reset link to user's email
 */
export async function sendPasswordResetLink(
    data: SendPasswordResetLinkRequest
): Promise<
    { success: true; data: SendPasswordResetLinkResponse } | { success: false; error: ApiError }
> {
    try {
        const response = await postAsJson<SendPasswordResetLinkResponse>('/auth/forgot-password', data);

        return {
            success: true,
            data: response,
        };
    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;
            const responseData = error.response.data || {};

            let messageKey = 'auth.forgotPassword.unknownError';
            let code = 'UNKNOWN_ERROR';
            let message = responseData.message || 'Failed to send password reset link';

            if (status === 404) {
                messageKey = 'auth.forgotPassword.emailNotFound';
                code = 'EMAIL_NOT_FOUND';
                message = responseData.message || 'Email address not found';
            } else if (status === 422) {
                messageKey = 'auth.forgotPassword.validationError';
                code = 'VALIDATION_ERROR';
                message = responseData.message || 'Invalid email address';
            } else if (status === 429) {
                messageKey = 'auth.forgotPassword.tooManyRequests';
                code = 'TOO_MANY_REQUESTS';
                message = responseData.message || 'Too many requests. Please try again later.';
            } else if (status >= 500) {
                messageKey = 'auth.forgotPassword.serverError';
                code = 'SERVER_ERROR';
            }

            const apiError: ApiError = {
                status,
                code,
                message,
                messageKey,
            };

            return {
                success: false as const,
                error: apiError,
            };
        }

        const apiError: ApiError = {
            status: 500,
            code: 'UNKNOWN_ERROR',
            message: error.message || 'Unknown error occurred while sending password reset link',
            messageKey: 'auth.forgotPassword.unknownError',
        };

        return {
            success: false,
            error: apiError,
        };
    }
}

/**
 * Reset password using token from email
 */
export async function resetPassword(
    data: ResetPasswordRequest
): Promise<{ success: true; data: ResetPasswordResponse } | { success: false; error: ApiError }> {
    try {
        const response = await postAsJson<ResetPasswordResponse>('/auth/reset-password', data);

        return {
            success: true,
            data: response,
        };
    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;
            const responseData = error.response.data || {};

            let messageKey = 'auth.resetPassword.unknownError';
            let code = 'UNKNOWN_ERROR';
            let message = responseData.message || 'Failed to reset password';

            if (status === 401) {
                messageKey = 'auth.resetPassword.invalidToken';
                code = 'INVALID_TOKEN';
                message = responseData.message || 'Invalid or expired reset token';
            } else if (status === 422) {
                messageKey = 'auth.resetPassword.validationError';
                code = 'VALIDATION_ERROR';
                message = responseData.message || 'Password validation failed';
            } else if (status >= 500) {
                messageKey = 'auth.resetPassword.serverError';
                code = 'SERVER_ERROR';
            }

            const apiError: ApiError = {
                status,
                code,
                message,
                messageKey,
            };

            return {
                success: false,
                error: apiError,
            };
        }

        const apiError: ApiError = {
            status: 500,
            code: 'UNKNOWN_ERROR',
            message: error.message || 'Unknown error occurred while resetting password',
            messageKey: 'auth.resetPassword.unknownError',
        };

        return {
            success: false,
            error: apiError,
        };
    }
}

/**
 * Update password for authenticated user
 */
export async function updatePassword(
    data: UpdatePasswordRequest
): Promise<{ success: true; data: UpdatePasswordResponse } | { success: false; error: ApiError }> {
    try {
        const response = await patchAsJson<UpdatePasswordResponse>('/auth/update-password', data);

        // If logout_all_devices is true, we might need to handle re-authentication
        // For now, we'll just return success and let the UI handle any necessary redirects

        return {
            success: true,
            data: response,
        };
    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;
            const responseData = error.response.data || {};

            let messageKey = 'auth.updatePassword.unknownError';
            let code = 'UNKNOWN_ERROR';
            let message = responseData.message || 'Failed to update password';

            if (status === 401) {
                messageKey = 'auth.updatePassword.invalidCredentials';
                code = 'INVALID_CREDENTIALS';
                message = responseData.message || 'Current password is incorrect';
            } else if (status === 422) {
                messageKey = 'auth.updatePassword.validationError';
                code = 'VALIDATION_ERROR';
                message = responseData.message || 'Password validation failed';
            } else if (status >= 500) {
                messageKey = 'auth.updatePassword.serverError';
                code = 'SERVER_ERROR';
            }

            const apiError: ApiError = {
                status,
                code,
                message,
                messageKey,
            };

            return {
                success: false,
                error: apiError,
            };
        }

        const apiError: ApiError = {
            status: 500,
            code: 'UNKNOWN_ERROR',
            message: error.message || 'Unknown error occurred while updating password',
            messageKey: 'auth.updatePassword.unknownError',
        };

        return {
            success: false,
            error: apiError,
        };
    }
}
