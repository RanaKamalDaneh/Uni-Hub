'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Reveals every `[data-reveal]` element as it scrolls into view (CSS in globals.css), including elements
 * added later, and feeds the pointer position to `.uh-spotlight` cards as --mx / --my.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-shown', '');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    const scan = (root: ParentNode) => root.querySelectorAll('[data-reveal]:not([data-shown])').forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => n instanceof Element && (n.matches('[data-reveal]') ? io.observe(n) : scan(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.uh-spotlight') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('pointermove', onMove);
    };
  }, [pathname]);

  return null;
}
