import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import type { FlagComponent } from 'country-flag-icons/react/3x2';
import { DE, ES, FR, NL, US } from 'country-flag-icons/react/3x2';

export const locales = ['en', 'nl', 'de', 'es', 'fr'];

export const languageMap: Record<string, { label: string; Icon: FlagComponent }> = {
    nl: { label: 'Nederlands', Icon: NL },
    en: { label: 'English', Icon: US },
    de: { label: 'Deutsch', Icon: DE },
    es: { label: 'Español', Icon: ES },
    fr: { label: 'Français', Icon: FR },
};

export const routing = defineRouting({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
