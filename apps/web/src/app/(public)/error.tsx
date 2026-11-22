'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

/**
 * Friendly fallback for any public page that fails to render (e.g. the API is unreachable),
 * instead of the host's crash page. Header and footer stay visible from the layout.
 */
export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errors');
  return (
    <section className="container flex flex-col items-center justify-center py-24 text-center">
      <p className="uh-gradient-text text-6xl font-extrabold">!</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">{t('loadFailed')}</h1>
      <p className="mt-2 max-w-md text-ink-muted">{t('network')}</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => reset()}>{t('retry')}</Button>
        <Button asChild variant="outline">
          <Link href="/">{t('backHome')}</Link>
        </Button>
      </div>
    </section>
  );
}
