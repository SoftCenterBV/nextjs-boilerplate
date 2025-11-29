import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

async function getMessages(locale: string) {
    try {
        return (await import(`@/messages/${locale}.json`)).default;
    } catch {
        notFound();
    }
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client side is the easiest way to get started
    const messages = await getMessages(locale);

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
        </NextIntlClientProvider>
    );
}
