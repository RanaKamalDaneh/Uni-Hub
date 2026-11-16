'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

const LINKS = [
  { href: '/', key: 'home' },
  { href: '/services', key: 'services' },
  { href: '/#how', key: 'how' },
  { href: '/#faq', key: 'faq' },
  { href: '/#contact', key: 'contact' },
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : !href.includes('#') && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur-md">
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive(l.href) ? 'text-brand-fg' : 'text-ink-muted hover:text-ink',
              )}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            href="/services"
            className="ms-1 inline-flex h-11 items-center rounded-xl bg-ink px-5 text-sm font-bold text-page transition hover:-translate-y-0.5 hover:bg-brand hover:text-brand-on"
          >
            {t('startOrder')}
          </Link>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <LanguageSwitcher className="px-2" />
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t('menu')}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-page lg:hidden">
          <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn('rounded-lg px-3 py-2.5 text-sm font-medium', isActive(l.href) ? 'bg-brand-light text-brand-fg' : 'text-ink')}
              >
                {t(l.key)}
              </Link>
            ))}
            <div className="mt-3 border-t border-line pt-4">
              <Link href="/services" className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-bold text-brand-on">
                {t('startOrder')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
