'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts up from 0 to `value` the first time it scrolls into view (instant with reduced motion). */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setN(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}

export function StatsCounter({ items }: { items: { value: number; label: string; suffix?: string }[] }) {
  return (
    <section className="container py-12">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((s, i) => (
          <div
            key={s.label}
            data-reveal="zoom"
            style={{ '--d': `${i * 100}ms` } as React.CSSProperties}
            className="uh-glow-card uh-spotlight group rounded-2xl border border-line bg-surface p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="uh-gradient-text block text-4xl font-extrabold sm:text-5xl" dir="ltr">
                {s.suffix}
                <CountUp value={s.value} />
              </span>
              <span className="mt-2 block text-sm text-ink-muted">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
