// Get domain for API requests
export function getApiDomain(): string {
    return process.env.NEXT_PUBLIC_API_DOMAIN || 'api.example.com';
}

// Get API version
export function getApiVersion(): string {
    const major = process.env.NEXT_PUBLIC_API_VERSION_MAJOR || '1';

    return `v${major}`;
}

// Get base URL for API requests
export function getBackendBaseUrl(): string {
    const domain = getApiDomain();

    if (domain.startsWith('http')) {
        return `${domain}/${getApiVersion()}`;
    }

    return `https://${domain}/${getApiVersion()}`;
}
