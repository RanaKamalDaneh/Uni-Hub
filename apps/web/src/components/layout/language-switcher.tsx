'use client';

import { LOCALE_COOKIE } from '@unihub/shared';
import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

/** Persists the choice for a year in a cookie, then re-renders server components in the new language. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => router.refresh());
      }}
      disabled={pending}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink transition hover:bg-surface-soft disabled:opacity-60',
        className,
      )}
      aria-label={`${t('language')}: ${t('switchTo')}`}
      lang={next}
    >
      <Languages className="h-4 w-4 text-brand-fg" aria-hidden />
      {t('switchTo')}
    </button>
  );
}
