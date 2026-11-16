'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const THEME_COOKIE = 'uh_theme';
type Theme = 'light' | 'dark';

/** Light/dark switch. Colours are CSS variables, so switching is instant and needs no reload. */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
      title={theme === 'dark' ? t('lightMode') : t('darkMode')}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition hover:border-brand hover:text-brand-fg',
        className,
      )}
    >
      {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" aria-hidden /> : <Moon className="h-[18px] w-[18px]" aria-hidden />}
    </button>
  );
}
