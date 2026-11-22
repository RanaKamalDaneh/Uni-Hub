'use client';

import { Check, MessageCircleMore, RefreshCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { whatsappLink } from '@/lib/contact';
import type { PackageDto } from '@/lib/types';
import { cn, loc } from '@/lib/utils';

/**
 * Package comparison + WhatsApp contact. The site is a showcase: no orders or payments are
 * processed online; the button opens WhatsApp with a pre-filled message naming the service and package.
 */
export function PackageSelector({
  packages,
  currency,
  serviceSlug,
  serviceTitle,
  whatsapp,
}: {
  packages: PackageDto[];
  currency: string;
  serviceSlug: string;
  serviceTitle: string;
  whatsapp: string | null;
}) {
  const t = useTranslations('services');
  const locale = useLocale();
  const [active, setActive] = useState(Math.min(1, packages.length - 1)); // Standard by default
  const p = packages[active];
  if (!p) return null;
  const features = locale === 'ar' ? p.featuresAr : p.featuresEn;

  const message = () =>
    t('whatsappMessage', {
      service: serviceTitle,
      package: loc(p, 'name', locale),
      url: `${window.location.origin}/service/${serviceSlug}`,
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div role="tablist" aria-label={t('packages')} className="grid border-b border-line" style={{ gridTemplateColumns: `repeat(${packages.length}, 1fr)` }}>
        {packages.map((pkg, i) => (
          <button
            key={pkg.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="pkg-panel"
            onClick={() => setActive(i)}
            className={cn(
              'relative py-3.5 text-sm font-semibold transition',
              i === active ? 'bg-surface text-brand-fg' : 'bg-surface-soft text-ink-muted hover:text-ink',
            )}
          >
            {loc(pkg, 'name', locale)}
            {i === active && <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand" aria-hidden />}
          </button>
        ))}
      </div>

      <div id="pkg-panel" role="tabpanel" className="p-6">
        <p className="text-sm text-ink-muted">{loc(p, 'description', locale)}</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink">
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-brand-fg" aria-hidden /> {t('revisions', { count: p.revisions })}
          </span>
        </div>

        <ul className="mt-5 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal-700">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {whatsapp ? (
            <a
              href={whatsappLink(whatsapp)}
              onClick={(e) => {
                // Build the message on click so it names the currently selected package.
                e.currentTarget.href = whatsappLink(whatsapp, message());
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#1EBE5A] hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t('contactWhatsapp')}
            </a>
          ) : (
            <p className="flex items-center gap-2 rounded-xl border border-dashed border-line bg-surface-soft px-4 py-3 text-sm text-ink-muted">
              <MessageCircleMore className="h-4 w-4 shrink-0" aria-hidden /> {t('whatsappMissing')}
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-ink-muted">{t('whatsappNote')}</p>
      </div>
    </div>
  );
}
