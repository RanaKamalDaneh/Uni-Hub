import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta');
  return { title: { default: t('title'), template: '%s · UniHub' }, description: t('description') };
}

export const viewport: Viewport = { themeColor: '#090D18', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  // Theme is chosen server-side from the cookie so the first paint is already correct (no flash). Default: dark.
  const theme = (await cookies()).get('uh_theme')?.value === 'light' ? 'light' : 'dark';
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} data-theme={theme} className={`${inter.variable} ${arabic.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
