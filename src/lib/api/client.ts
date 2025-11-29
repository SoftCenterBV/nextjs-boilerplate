import { ofetch} from "ofetch";

import { getSessionTokenFromBrowser } from "@/lib/api/browser-utils";
import { getBackendBaseUrl} from "@/lib/api/url-utils";

// Define a custom type for URLs that ensures they are prefixed with a slash
export type SlashPrefixedUrl = `/${string}`;

// Check if code is running on server
// Changed from constant to function to make it mockable in tests
export function isServer(): boolean {
    return typeof window === 'undefined';
}
// Create API client instance
export const apiClient = ofetch.create({
    baseURL: getBackendBaseUrl(),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    async onRequest({ options }: any) {
        options.credentials = 'include';

        // Convert array params to query string
        const { params } = options;
        if (params && typeof params === 'object') {
            Object.keys(params).forEach((key) => {
                if (Array.isArray(params[key]) && key.endsWith('[]')) {
                    params[`${key}[]`] = params[key];
                    delete params[key];
                }
            });
        }

        if (isServer()) {
            await setServerHeaders(options);
        } else {
            await setBrowserHeaders(options);
        }

        // If we're sending a FormData object, the default Content-Type header (application/json) is not needed
        if (options.body instanceof FormData) {
            options.headers.delete('Content-Type');
        }
    },
    async onResponseError({ request, response }: any) {
        // Make a formatted error body string.
        let responseBody = '';
        try {
            // eslint-disable-next-line no-underscore-dangle
            responseBody = JSON.stringify(await response._data, null, 2);
        } catch (e) {
            // If JSON parsing fails, just use the default body.
        }

        // For login requests we don't need to handle redirecting.
        if (request.endsWith('/auth/login')) {
            return response;
        }

        // Note: ofetch will still throw an error after this handler runs.
    },
});

// Utility functions for different HTTP methods
export const fetchAsJson = <T = unknown>(
    url: SlashPrefixedUrl,
    params?: Record<string, any>
): Promise<T> => {
    return apiClient<T>(url, { params, method: 'GET' });
};

export const deleteAsJson = <T = unknown>(url: SlashPrefixedUrl, data?: any): Promise<T> => {
    return apiClient<T>(url, { method: 'DELETE', body: data });
};

export const postAsJson = <T = unknown>(url: SlashPrefixedUrl, data?: any): Promise<T> => {
    return apiClient<T>(url, { method: 'POST', body: data });
};

// This function is needed as a workaround to not hit issues with auth in routes that should ignore auth.
// Currently only used for accepting organization invites where the user creates a new account.
export const postAsJsonNoAuth = <T = unknown>(url: SlashPrefixedUrl, data?: any): Promise<T> => {
    return apiClient<T>(url, { method: 'POST', body: data, skipAuth: true } as any);
};

export const putAsJson = <T = unknown>(url: SlashPrefixedUrl, data?: any): Promise<T> => {
    return apiClient<T>(url, { method: 'PUT', body: data });
};

export const patchAsJson = <T = unknown>(url: SlashPrefixedUrl, data?: any): Promise<T> => {
    return apiClient<T>(url, { method: 'PATCH', body: data });
};

/**
 * Build query parameters for list endpoints with pagination, sorting, and filtering support
 */
export const buildListParams = (params?: {
    pagination?: { page?: number; perPage?: number };
    sort?: string;
    filter?: { search?: string; organization?: string; status?: string };
}): Record<string, any> => {
    const queryParams: Record<string, any> = {};

    // Handle pagination
    if (params?.pagination?.page) {
        queryParams.page = params.pagination.page;
    }

    if (params?.pagination?.perPage) {
        queryParams.per_page = params.pagination.perPage;
    }

    // Handle sorting
    if (params?.sort) {
        queryParams.sort = params.sort;
    }

    // Handle filters - Laravel expects filter[key] format
    if (params?.filter?.search) {
        queryParams['filter[search]'] = params.filter.search;
    }

    if (params?.filter?.organization) {
        queryParams['filter[organization]'] = params.filter.organization;
    }

    if (params?.filter?.status) {
        queryParams['filter[status]'] = params.filter.status;
    }

    return queryParams;
};

// No need to set refreshToken implementation anymore as it's directly implemented in auth-service.ts

// Define pagination response type
export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

// Helper function to set server-side headers
export async function setServerHeaders(options: any): Promise<void> {
    const { headers, cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const headersList = await headers();

    const sessionToken = cookieStore.get(process.env.SESSION_COOKIE || 'session')?.value;

    options.headers.set('Cookie', headersList.get('cookie') ?? '');

    // Skip Authorization header if explicitly requested
    if (!options.skipAuth) {
        options.headers.set('Authorization', `Bearer ${sessionToken ?? ''}`);
    }

    // Always set these headers
    options.headers.set('Referer', `http://${headersList.get('host')}`);
    options.headers.set('x-xsrf-token', cookieStore.get('XSRF-TOKEN')?.value ?? '');
}

// Helper function to set browser-side headers
export async function setBrowserHeaders(options: any): Promise<void> {
    // Get XSRF token from cookies
    const xsrfToken =
        decodeURIComponent(
            document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, '$1')
        ) ?? '';

    // Set XSRF token header
    options.headers.set('x-xsrf-token', xsrfToken);

    // Get session token from cookies
    const sessionToken = getSessionTokenFromBrowser();

    if (sessionToken) {
        options.headers.set('Authorization', `Bearer ${sessionToken}`);
    }
}
