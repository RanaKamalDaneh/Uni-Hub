import { LOCALE_COOKIE, SUPPORTED_LOCALES, type AppLocale } from '@unihub/shared';
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

/**
 * Locale resolution (no URL prefix, so routes match the spec):
 * 1. NEXT_LOCALE cookie (set by the language switcher; persists across sessions)
 *
 * 2. Arabic (default for first-time visitors)
 */
export async function resolveLocale(): Promise<AppLocale> {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (fromCookie && (SUPPORTED_LOCALES as readonly string[]).includes(fromCookie)) return fromCookie as AppLocale;
  // First visit: Arabic by default.
  return 'ar';
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Asia/Amman',
  };
});
