import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Picks the localized column (`xxxEn` / `xxxAr`) from catalog records. */
export function loc(record: object, field: string, locale: string): string {
  const r = record as Record<string, unknown>;
  const key = `${field}${locale === 'ar' ? 'Ar' : 'En'}`;
  return (r[key] as string) || (r[`${field}En`] as string) || '';
}

/** Provider name/title/bio in the visitor language, falling back to the original text. */
export function providerText(p: { title: string; titleAr?: string | null; bio?: string; bioAr?: string | null; displayNameAr?: string | null; user: { fullName: string } }, locale: string) {
  const ar = locale === "ar";
  return {
    name: (ar && p.displayNameAr) || p.user.fullName,
    title: (ar && p.titleAr) || p.title,
    bio: (ar && p.bioAr) || p.bio || "",
  };
}

export function formatMoney(amount: number | string, locale: string, currency = 'JOD') {
  // Western digits in Arabic too (common for prices in Jordan); hide ".00" on whole amounts.
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-JO-u-nu-latn' : 'en-JO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
