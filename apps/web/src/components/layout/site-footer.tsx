import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Logo } from './logo';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const links = [
    { href: '/', label: nav('home') },
    { href: '/services', label: nav('services') },
    { href: '/#how', label: nav('how') },
    { href: '/#faq', label: nav('faq') },
    { href: '/#contact', label: nav('contact') },
  ];

  return (
    <footer className="border-t border-line">
      <div className="container flex flex-col items-center justify-between gap-5 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-5">
          <Logo />
          <p className="text-sm text-ink-muted">{t('rights', { year: new Date().getFullYear() })}</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-muted transition hover:text-brand-fg">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
