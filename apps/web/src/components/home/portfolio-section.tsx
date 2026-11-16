import { getTranslations } from 'next-intl/server';

/**
 * "What our work looks like": illustrative mock-ups of typical deliverables (clearly labelled as samples).
 * Replace an item's `art` with a real screenshot (<img src="/portfolio/…">) when real work is available.
 */

const box = 'fill-surface stroke-line';
const text = 'fill-ink-muted';

function ErdArt() {
  const table = (x: number, y: number, title: string, rows: string[]) => (
    <g>
      <rect x={x} y={y} width="96" height={26 + rows.length * 18} rx="8" className={box} strokeWidth="1.5" />
      <rect x={x} y={y} width="96" height="24" rx="8" fill="#2563EB" />
      <text x={x + 48} y={y + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
        {title}
      </text>
      {rows.map((r, i) => (
        <text key={r} x={x + 10} y={y + 41 + i * 18} fontSize="10" className={text} fontFamily="monospace">
          {r}
        </text>
      ))}
    </g>
  );
  return (
    <>
      {table(16, 30, 'Student', ['🔑 id', 'name', 'major'])}
      {table(208, 18, 'Book', ['🔑 isbn', 'title', 'author', 'year'])}
      {table(112, 120, 'Loan', ['🔑 id', 'due_date'])}
      <path d="M112 70 C 140 70, 130 140, 112 150" className="stroke-brand" strokeWidth="2" fill="none" />
      <path d="M208 60 C 190 60, 230 150, 208 150" className="stroke-brand" strokeWidth="2" fill="none" />
    </>
  );
}

function DashboardArt() {
  const bars = [60, 95, 75, 120, 100, 140];
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={16 + i * 100} y="16" width="88" height="40" rx="8" className={box} strokeWidth="1.5" />
          <rect x={26 + i * 100} y="26" width="34" height="6" rx="3" className="fill-line" />
          <text x={26 + i * 100} y="48" fontSize="13" fontWeight="800" className="fill-ink">
            {['12.4K', '87%', '+23%'][i]}
          </text>
        </g>
      ))}
      <rect x="16" y="66" width="188" height="118" rx="8" className={box} strokeWidth="1.5" />
      {bars.map((h, i) => (
        <rect key={i} x={30 + i * 28} y={174 - h * 0.7} width="18" height={h * 0.7} rx="4" fill={i === 5 ? '#2563EB' : '#93C5FD'} />
      ))}
      <rect x="214" y="66" width="90" height="118" rx="8" className={box} strokeWidth="1.5" />
      <circle cx="259" cy="125" r="32" fill="none" stroke="#DBEAFE" strokeWidth="14" />
      <circle cx="259" cy="125" r="32" fill="none" stroke="#2563EB" strokeWidth="14" strokeDasharray="140 201" transform="rotate(-90 259 125)" />
    </>
  );
}

function SpssArt() {
  const rows = [
    ['Variable', 'Mean', 'SD', 'Sig.'],
    ['Q1', '4.12', '0.81', '.000'],
    ['Q2', '3.87', '0.92', '.003'],
    ['Q3', '4.35', '0.66', '.000'],
    ['Q4', '3.21', '1.04', '.214'],
  ];
  return (
    <>
      <rect x="16" y="16" width="288" height="168" rx="8" className={box} strokeWidth="1.5" />
      <text x="30" y="38" fontSize="11" fontWeight="700" className="fill-ink">
        Descriptive Statistics (N = 214)
      </text>
      {rows.map((r, i) => (
        <g key={i}>
          {i > 0 && <line x1="30" x2="290" y1={52 + i * 24} y2={52 + i * 24} className="stroke-line" />}
          {r.map((c, j) => (
            <text
              key={j}
              x={30 + j * 70}
              y={70 + i * 24}
              fontSize="10.5"
              fontFamily="monospace"
              fontWeight={i === 0 ? 700 : 400}
              className={i > 0 && j === 3 && c !== '.214' ? 'fill-brand-fg' : i === 0 ? 'fill-ink' : text}
            >
              {c}
            </text>
          ))}
        </g>
      ))}
    </>
  );
}

function AppArt() {
  return (
    <>
      <rect x="112" y="8" width="96" height="184" rx="16" className="fill-ink" />
      <rect x="118" y="20" width="84" height="164" rx="10" className="fill-surface" />
      <rect x="124" y="28" width="72" height="26" rx="6" fill="#2563EB" />
      <text x="160" y="45" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
        Book a visit
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="124" y={62 + i * 36} width="72" height="30" rx="6" className="fill-surface-soft stroke-line" />
          <circle cx="136" cy={77 + i * 36} r="7" fill={['#93C5FD', '#A5B4FC', '#67E8F9'][i]} />
          <rect x="148" y={71 + i * 36} width="38" height="5" rx="2.5" className="fill-line" />
          <rect x="148" y={80 + i * 36} width="24" height="4" rx="2" className="fill-line" />
        </g>
      ))}
      <rect x="124" y="166" width="72" height="12" rx="6" fill="#2563EB" />
      <rect x="24" y="60" width="72" height="80" rx="10" className={box} strokeWidth="1.5" />
      <text x="60" y="84" textAnchor="middle" fontSize="20">📅</text>
      <rect x="36" y="100" width="48" height="6" rx="3" className="fill-line" />
      <rect x="36" y="114" width="32" height="6" rx="3" className="fill-line" />
      <rect x="224" y="60" width="72" height="80" rx="10" className={box} strokeWidth="1.5" />
      <text x="260" y="84" textAnchor="middle" fontSize="20">🩺</text>
      <rect x="236" y="100" width="48" height="6" rx="3" className="fill-line" />
      <rect x="236" y="114" width="32" height="6" rx="3" className="fill-line" />
    </>
  );
}

function MlArt() {
  const m = [
    [48, 2, 1],
    [3, 45, 4],
    [1, 3, 46],
  ];
  return (
    <>
      <text x="22" y="30" fontSize="11" fontWeight="700" className="fill-ink">
        Confusion matrix
      </text>
      {m.map((row, i) =>
        row.map((v, j) => (
          <g key={`${i}${j}`}>
            <rect x={22 + j * 44} y={42 + i * 44} width="40" height="40" rx="6" fill="#2563EB" fillOpacity={0.12 + (v / 50) * 0.85} />
            <text x={42 + j * 44} y={67 + i * 44} textAnchor="middle" fontSize="12" fontWeight="700" fill={v > 20 ? '#fff' : '#1E3A8A'}>
              {v}
            </text>
          </g>
        )),
      )}
      <text x="180" y="30" fontSize="11" fontWeight="700" className="fill-ink">
        Accuracy
      </text>
      <polyline points="180,170 205,140 230,120 255,100 280,92 300,88" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      <polyline points="180,172 205,150 230,135 255,124 280,118 300,116" fill="none" stroke="#93C5FD" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
      <line x1="180" x2="300" y1="176" y2="176" className="stroke-line" />
      <text x="300" y="80" textAnchor="end" fontSize="13" fontWeight="800" className="fill-brand-fg">
        94.2%
      </text>
    </>
  );
}

function ReportArt() {
  const lines = (x: number, y: number, n: number, w = 90) =>
    Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={y + i * 10} width={i === n - 1 ? w * 0.6 : w} height="4" rx="2" className="fill-line" />);
  return (
    <>
      <rect x="40" y="14" width="110" height="172" rx="6" className={box} strokeWidth="1.5" />
      <rect x="52" y="30" width="86" height="8" rx="4" fill="#2563EB" />
      <text x="52" y="58" fontSize="9" fontWeight="700" className="fill-ink">
        Table of Contents
      </text>
      {['1. Introduction', '2. Methodology', '3. Results', '4. Discussion', 'References'].map((s, i) => (
        <text key={s} x="52" y={76 + i * 14} fontSize="8" className={text}>
          {s}
        </text>
      ))}
      <rect x="170" y="14" width="110" height="172" rx="6" className={box} strokeWidth="1.5" />
      <text x="182" y="34" fontSize="9" fontWeight="700" className="fill-ink">
        References (APA 7)
      </text>
      {lines(182, 46, 3)}
      {lines(182, 86, 3)}
      {lines(182, 126, 3)}
    </>
  );
}

const ITEMS = [
  { key: 'erd', art: <ErdArt />, tags: ['ERD', 'MySQL'] },
  { key: 'dashboard', art: <DashboardArt />, tags: ['Power BI', 'DAX'] },
  { key: 'spss', art: <SpssArt />, tags: ['SPSS', 'APA'] },
  { key: 'app', art: <AppArt />, tags: ['Flutter', 'Firebase'] },
  { key: 'ml', art: <MlArt />, tags: ['Python', 'PyTorch'] },
  { key: 'report', art: <ReportArt />, tags: ['Word', 'APA 7'] },
] as const;

export async function PortfolioSection() {
  const t = await getTranslations('portfolio');
  return (
    <section className="container pb-20">
      <div data-reveal className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t('title')}</h2>
        <span aria-hidden className="uh-gradient-bg mt-4 block h-1 w-16 rounded-full" />
        <p className="mt-3 text-ink-muted">{t('subtitle')}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <figure
            key={item.key}
            data-reveal
            style={{ '--d': `${(i % 3) * 110}ms` } as React.CSSProperties}
            className="uh-glow-card group overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift"
          >
            <div className="relative bg-surface-soft">
              <svg viewBox="0 0 320 200" className="h-auto w-full transition duration-500 group-hover:scale-[1.03]" role="img" aria-label={t(`items.${item.key}.title`)} direction="ltr">
                {item.art}
              </svg>
              <span className="absolute start-3 top-3 rounded-full bg-page/80 px-2.5 py-1 text-[11px] font-semibold text-ink-muted backdrop-blur">
                {t('badge')}
              </span>
            </div>
            <figcaption className="p-5">
              <p className="text-xs font-semibold text-brand-fg">{t(`items.${item.key}.cat`)}</p>
              <h3 className="mt-1.5 font-bold text-ink">{t(`items.${item.key}.title`)}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5" dir="ltr">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
