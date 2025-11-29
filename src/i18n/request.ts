import { getRequestConfig } from 'next-intl/server';
import * as Sentry from '@sentry/nextjs';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        messages: (await import(`../messages/${locale}.json`)).default,
        locale,

        onError: (error) => {
            Sentry.captureException(error);
        },
    };
});
