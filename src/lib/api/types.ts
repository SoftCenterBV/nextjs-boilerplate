export type ApiVersion = {
    major: number;
    minor: number;
};

export type EndpointConfig = {
    path: string;
    version?: ApiVersion;
};

export type ApiClientOptions = {
    baseUrl?: string;
    defaultVersion?: ApiVersion;
    headers?: Record<string, string>;
};

/**
 * Structured API error type for better error handling
 */
export type ApiError = {
    status: number;
    code: string;
    message: string;
    messageKey?: string; // Translation key
};

/**
 * User data structure based on API specification
 */

export type UserData = {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string | null;
        language: string;
        metadata: string[];
        is_system_admin: boolean;
        organization_id: string | null;
        role: string;
        two_factor_enabled: boolean;
        created_at: string;
        updated_at: string;
        organization: OrganizationData | null;
};

/**
 * Organization data structure based on API specification
 */
export type OrganizationData = {
    id: string | null;
    name: string;
    type?: 'default' | 'partner' | 'affiliate';
    phone_number: string;
    employee_amount: string;
    vat_number: string | null;
    chamber_of_commerce: string | null;
    street: string | null;
    street_number: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null; // Should be 2 chars
    billing_email: string | null;
    billing_details: string | null;
    metadata: string[] | null; // Spec says array of strings, but example shows null? Assuming array or null.
    platform_id: string | null;
    owner_id: string | null;
    parent_id: string | null;
    created_at: string | null; // ISO 8601 date string
    updated_at: string | null; // ISO 8601 date string
};


/**
 * 2FA Setup response structure based on API specification
 */
export type TwoFactorSetupResponse = {
    message: string;
    confirm_url: string;
    qr_code: string;
    secret: string;
};

/**
 * 2FA QR Code response structure based on API specification
 * Can return string, object with URLs, or message object
 */
export type TwoFactorQrCodeResponse =
    | string
    | { qr_code_url: string; qr_code_image: string; secret: string }
    | { message: string };

/**
 * 2FA Verify response structure based on API specification
 * Can return success message with token or error message
 */
export type TwoFactorVerifyResponse = { message: string; recovery_codes: string[] };

/**
 * 2FA Disable response structure based on API specification
 */
export type TwoFactorDisableResponse = {
    message: string;
};

/**
 * 2FA Backup Codes response structure based on API specification
 */
export type TwoFactorBackupCodesResponse = {
    message: string;
    recovery_codes: string[] | string;
};


/**
 * Product data structure based on API specification
 */