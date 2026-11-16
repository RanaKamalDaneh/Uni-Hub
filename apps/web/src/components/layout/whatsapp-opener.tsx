'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Target = { phone: string; text: string };

/** Parses a https://wa.me/<phone>?text=… link into its parts. */
function parseWaLink(href: string): Target | null {
  try {
    const u = new URL(href);
    if (u.hostname !== 'wa.me') return null;
    const phone = u.pathname.replace(/\D/g, '');
    if (!phone) return null;
    return { phone, text: u.searchParams.get('text') ?? '' };
  } catch {
    return null;
  }
}

function query({ phone, text }: Target) {
  return `phone=${phone}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
}

/**
 * Makes every wa.me link on the page open the WhatsApp app straight into the chat
 * (desktop app or phone app) instead of the wa.me landing page in the browser.
 * If the app does not open (not installed), a small prompt offers WhatsApp Web instead.
 */
export function WhatsAppOpener() {
  const t = useTranslations('contact');
  const [fallback, setFallback] = useState<Target | null>(null);

  useEffect(() => {
    let timer = 0;

    // Bubble phase on document: runs after React handlers, so links whose href is
    // built on click (package selector) are read with their final message.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const target = parseWaLink(a.href);
      if (!target) return;

      e.preventDefault();
      setFallback(null);
      window.clearTimeout(timer);

      let left = false;
      const markLeft = () => {
        left = true;
      };
      window.addEventListener('blur', markLeft, { once: true });
      document.addEventListener('visibilitychange', markLeft, { once: true });

      window.location.href = `whatsapp://send?${query(target)}`;

      // If the page never lost focus, the app most likely is not installed.
      timer = window.setTimeout(() => {
        window.removeEventListener('blur', markLeft);
        document.removeEventListener('visibilitychange', markLeft);
        if (!left && document.visibilityState === 'visible') setFallback(target);
      }, 2500);
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      window.clearTimeout(timer);
    };
  }, []);

  if (!fallback) return null;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const webHref = isMobile
    ? `https://api.whatsapp.com/send?${query(fallback)}`
    : `https://web.whatsapp.com/send?${query(fallback)}`;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-sm rounded-2xl border border-line bg-surface p-4 shadow-lift sm:end-5 sm:start-auto sm:mx-0"
    >
      <p className="text-sm font-semibold text-ink">{t('appNotOpened')}</p>
      <p className="mt-1 text-xs text-ink-muted">{t('appNotOpenedHint')}</p>
      <div className="mt-3 flex gap-2">
        <a
          href={webHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setFallback(null)}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white transition hover:bg-[#1EBE5A]"
        >
          {t('openWeb')}
        </a>
        <button
          type="button"
          onClick={() => setFallback(null)}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-line px-4 text-sm text-ink-muted transition hover:text-ink"
        >
          {t('dismiss')}
        </button>
      </div>
    </div>
  );
}
