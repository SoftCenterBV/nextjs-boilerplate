import type { ApiError } from './types'; // Import ApiError type

/**
 * Handles API errors by parsing the error response and returning a structured ApiError object.
 * TODO: Add generic sentry error handling for all API errors.
 */
export function handleApiError(error: any, defaultMessageKey: string): ApiError {
    // Check error.data first (populated by onResponseError in client.ts)
    if (error.data) {
        const status = error.response?.status || 500; // Still get status from response if possible
        // Prioritize the actual message from the parsed error data
        const apiMessage = error.data.message;
        const message =
            typeof apiMessage === 'string' && apiMessage.length > 0
                ? apiMessage
                : 'An unexpected error occurred.'; // Fallback only if API message is missing/empty
        let code = 'UNKNOWN_API_ERROR'; // Default code
        let messageKey = defaultMessageKey; // Use default key initially

        // Keep the status code mapping for specific error types/keys if needed

        // Example: Map specific status codes or error messages from the API response
        // You might need to adjust this based on your actual API error structure
        if (status === 400) {
            code = 'BAD_REQUEST';
            // Use error.data.code here
            messageKey = error.data.code || defaultMessageKey; // Use API code if available
        } else if (status === 401) {
            code = 'UNAUTHENTICATED';
            messageKey = 'errors.unauthenticated'; // Specific key for 401
        } else if (status === 403) {
            code = 'FORBIDDEN';
            messageKey = 'errors.forbidden'; // Specific key for 403
            // Removed specific 404 handling here to allow specialized handling elsewhere
        } else if (status === 422) {
            code = 'VALIDATION_FAILED';
            messageKey = 'errors.validationFailed'; // Specific key for 422
        } else if (status >= 500) {
            code = 'SERVER_ERROR';
            messageKey = 'errors.serverError'; // Specific key for 5xx
        }

        return {
            status,
            code,
            message,
            messageKey,
        };
    }

    // Generic error handling for non-API errors (e.g., network issues)
    return {
        status: 500, // Default to 500 for unknown errors
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
        messageKey: 'errors.unknown', // Generic unknown error key
    };
}
