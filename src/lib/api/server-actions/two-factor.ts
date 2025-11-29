'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'; // Import cookies
import * as Sentry from '@sentry/nextjs';

import { deleteAsJson, postAsJson } from '../client';
import { handleApiError } from '../server-actions-utils'; // Ensure this is imported
import type {
    ApiError,
    TwoFactorBackupCodesResponse,
    TwoFactorDisableResponse,
    TwoFactorQrCodeResponse,
    TwoFactorSetupResponse,
    TwoFactorVerifyResponse, // Need UserData if we could fetch it
} from '../types';

import { isValidReturnUrl } from './auth'; // Import the helper from auth actions

/**
 * Type for the request body of the 2FA verification during login.
 */
export type VerifyLogin2FARequest = {
    login_token: string;
    code?: string;
    recovery_code?: string;
    returnTo?: string; // Include returnTo for redirect after successful verification
};

/**
 * Type for the successful response from POST /auth/login/2fa.
 * Based on the API spec provided.
 */
export type VerifyLogin2FAResponse = {
    message: string; // e.g., "Login successful" or "Login successful using recovery code"
    token: string; // The final access token
    user: {
        id: string | null;
        first_name: string;
        last_name: string;
        email: string;
        language: string;
    };
};

/**
 * Initiates the Two-Factor Authentication setup process.
 */
export async function setupTwoFactor(): Promise<
    { success: true; data: TwoFactorSetupResponse } | { success: false; error: ApiError }
> {
    return Sentry.withServerActionInstrumentation(
        'twoFactor.setupTwoFactor',
        { recordResponse: true },
        async () => {
            try {
                const response = await postAsJson<TwoFactorSetupResponse>('/auth/2fa');
                return { success: true as const, data: response };
            } catch (error: any) {
                // Use handleApiError, relying on parsed data from onResponseError
                return {
                    success: false as const,
                    error: handleApiError(error, 'profile.security.twoFactor.setupError'),
                };
            }
        }
    );
}

/**
 * Confirms the Two-Factor Authentication setup with a verification code.
 * This is used during the profile setup process.
 */
export async function verifyTwoFactorCodeForProfile(
    code: string
): Promise<{ success: true; data: TwoFactorVerifyResponse } | { success: false; error: ApiError }> {
    return Sentry.withServerActionInstrumentation(
        'twoFactor.verifyTwoFactorCodeForProfile',
        { recordResponse: true },
        async () => {
            try {
                // Using the new confirm endpoint for 2FA setup
                const response = await postAsJson<TwoFactorVerifyResponse>('/auth/2fa/confirm', { code });
                return { success: true as const, data: response };
            } catch (error: any) {
                // Use handleApiError with profile-specific message key
                return {
                    success: false as const,
                    error: handleApiError(error, 'profile.security.twoFactor.verifyError'),
                };
            }
        }
    );
}

/**
 * Verifies the Two-Factor Authentication code provided by the user during LOGIN.
 * Handles setting the session cookie and redirecting.
 */
export async function verifyLogin2FA(
    request: VerifyLogin2FARequest
): Promise<
    | { success: true; redirectUrl: string; data: VerifyLogin2FAResponse }
    | { success: false; error: ApiError }
> {
    return Sentry.withServerActionInstrumentation(
        'twoFactor.verifyLogin2FA',
        { recordResponse: true },
        async () => {
            const { login_token, code, recovery_code, returnTo } = request;

            // Prepare the request body - either code or recovery_code should be provided
            const requestBody: Record<string, string> = { login_token };
            if (code) {
                requestBody.code = code;
            } else if (recovery_code) {
                requestBody.recovery_code = recovery_code;
            }

            try {
                // Use the new 2FA login endpoint
                const response = await postAsJson<VerifyLogin2FAResponse>('/auth/login/2fa', requestBody);

                // If verification is successful, the response contains the token and user data
                const cookieStore = await cookies();
                const sessionCookieName = process.env.SESSION_COOKIE || 'session';
                const userIdCookieName = process.env.USER_ID_COOKIE || 'user_id';

                // Default expiration time
                const defaultExpiresInSeconds = process.env.SESSION_DEFAULT_EXPIRES_IN
                    ? parseInt(process.env.SESSION_DEFAULT_EXPIRES_IN, 10)
                    : 3600; // Default to 1 hour

                const cookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'lax' as const,
                    expires: new Date(Date.now() + defaultExpiresInSeconds * 1000),
                };

                // Set the main session token cookie
                cookieStore.set(sessionCookieName, response.token, cookieOptions);

                // Set user ID cookie if user data is available
                if (response.user && response.user.id) {
                    cookieStore.set(userIdCookieName, response.user.id, cookieOptions);
                }

                // Revalidate root layout after successful login
                revalidatePath('/', 'layout');

                // Determine redirect URL
                const redirectUrl = (await isValidReturnUrl(returnTo)) ? (returnTo as string) : '/';

                return { success: true as const, redirectUrl, data: response };
            } catch (error: any) {
                // Use handleApiError with a login-specific message key
                // Map specific 2FA errors if needed (e.g., invalid code)
                let messageKey = 'auth.login.verify2FAError'; // Default error message key
                if (error.response?.status === 401) {
                    // Check if the error message indicates an invalid code
                    const errorMessage = error.data?.message?.toLowerCase() || '';
                    if (
                        errorMessage.includes('invalid 2fa code') ||
                        errorMessage.includes('invalid recovery code') ||
                        errorMessage.includes('login token is invalid or expired')
                    ) {
                        messageKey = 'auth.login.invalid2FACode';
                    }
                }
                return {
                    success: false as const,
                    error: handleApiError(error, messageKey),
                };
            }
        }
    );
}

/**
 * Disables Two-Factor Authentication for the user (used in profile).
 * Can use either a regular 2FA code or a recovery code.
 */
export async function disableTwoFactor(
    password: string,
    code?: string,
    recovery_code?: string
): Promise<
    { success: true; data: TwoFactorDisableResponse } | { success: false; error: ApiError }
> {
    return Sentry.withServerActionInstrumentation(
        'twoFactor.disableTwoFactor',
        { recordResponse: true },
        async () => {
            try {
                // Prepare the request body - either code or recovery_code should be provided
                const requestBody: Record<string, string> = { password };
                if (code) {
                    requestBody.code = code;
                } else if (recovery_code) {
                    requestBody.recovery_code = recovery_code;
                }

                // Use DELETE method with query parameters
                // Ensure the endpoint is properly typed as SlashPrefixedUrl
                const endpoint = `/auth/2fa` as const;

                // Using the client's deleteAsJson method
                const response = await deleteAsJson<TwoFactorDisableResponse>(endpoint, requestBody);
                revalidatePath('/profile/security');
                return { success: true as const, data: response };
            } catch (error: any) {
                // Use handleApiError
                return {
                    success: false as const,
                    error: handleApiError(error, 'profile.security.twoFactor.disableError'),
                };
            }
        }
    );
}

/**
 * Retrieves the QR code for setting up Two-Factor Authentication.
 * This is now part of the initial setup response in the new API.
 * This method is kept for backward compatibility but now just calls setupTwoFactor.
 */
export async function getTwoFactorQrCode(): Promise<
    { success: true; data: TwoFactorQrCodeResponse } | { success: false; error: ApiError }
> {
    return Sentry.withServerActionInstrumentation(
        'twoFactor.getTwoFactorQrCode',
        { recordResponse: true },
        async () => {
            // In the new API, the QR code is returned as part of the initial setup
            // So we just call setupTwoFactor and transform the response
            const setupResult = await setupTwoFactor();

            if (setupResult.success) {
                // Transform the setup response to match the expected QrCodeResponse format
                const qrCodeResponse: TwoFactorQrCodeResponse = {
                    qr_code_url: setupResult.data.qr_code,
                    qr_code_image: setupResult.data.qr_code,
                    secret: setupResult.data.secret,
                };

                return { success: true as const, data: qrCodeResponse };
            }

            // If setup failed, return the error
            return {
                success: false as const,
                error: setupResult.error,
            };
        }
    );
}

/**
 * Generates a new set of backup codes for Two-Factor Authentication.
 */
export async function generateBackupCodes(
    code: string
): Promise<
    { success: true; data: TwoFactorBackupCodesResponse } | { success: false; error: ApiError }
> {
    return Sentry.withServerActionInstrumentation(
        'twoFactor.generateBackupCodes',
        { recordResponse: true },
        async () => {
            try {
                const response = await postAsJson<TwoFactorBackupCodesResponse>(
                    '/auth/2fa/recovery-codes',
                    {
                        code,
                    }
                );
                return { success: true as const, data: response };
            } catch (error: any) {
                // Use handleApiError
                return {
                    success: false as const,
                    error: handleApiError(error, 'profile.security.twoFactor.generateBackupCodesError'),
                };
            }
        }
    );
}
