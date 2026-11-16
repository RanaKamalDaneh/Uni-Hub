import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="bg-gradient-to-br from-brand to-violet bg-clip-text text-7xl font-extrabold text-transparent">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">{t('notFoundTitle')}</h1>
        <p className="mt-2 text-ink-muted">{t('notFoundText')}</p>
        <Button asChild className="mt-8">
          <Link href="/">{t('backHome')}</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
