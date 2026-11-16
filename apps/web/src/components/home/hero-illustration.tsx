/**
 * Original illustration: a student with glasses working at a laptop, inside a ringed circle with a
 * blue accent arc. Theme-aware: background shapes use CSS-variable colours so it fits light and dark.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 520" className={className} role="img" aria-hidden>
      {/* rings */}
      <circle cx="280" cy="255" r="238" fill="none" className="stroke-line" strokeWidth="1.5" />
      <circle cx="280" cy="255" r="206" className="fill-slate-100 dark:fill-surface-raised" />
      {/* animated blue arc */}
      <path
        d="M70 140 A238 238 0 0 1 230 22"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="5"
        strokeLinecap="round"
        className="animate-uh-draw [stroke-dasharray:260]"
      />

      {/* desk */}
      <rect x="70" y="438" width="420" height="12" rx="6" className="fill-ink-muted/40" />

      {/* books */}
      <rect x="96" y="414" width="80" height="18" rx="4" fill="#3B5BA9" />
      <rect x="104" y="396" width="72" height="18" rx="4" fill="#64748B" />
      <rect x="98" y="378" width="76" height="18" rx="4" fill="#38BDF8" />

      {/* mug */}
      <rect x="402" y="390" width="40" height="46" rx="9" fill="#F1F5F9" />
      <path d="M442 402 h8 a10 10 0 0 1 0 20 h-8" stroke="#F1F5F9" strokeWidth="6" fill="none" />
      <path d="M414 380 q6 -8 0 -16 M428 380 q6 -8 0 -16" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".6" />

      {/* torso */}
      <path d="M186 438 C186 368 220 322 280 322 C340 322 374 368 374 438 Z" fill="#E2E8F0" />
      <path d="M252 324 L280 360 L308 324" stroke="#CBD5E1" strokeWidth="4" fill="none" strokeLinejoin="round" />
      {/* neck */}
      <rect x="264" y="290" width="32" height="38" rx="10" fill="#B87A4B" />

      {/* head */}
      <circle cx="221" cy="246" r="11" fill="#C68B59" />
      <circle cx="339" cy="246" r="11" fill="#C68B59" />
      <ellipse cx="280" cy="240" rx="58" ry="62" fill="#C68B59" />
      <path d="M222 236 C214 186 246 168 282 168 C320 168 346 190 338 236 C330 214 314 202 292 200 C268 210 246 214 222 236 Z" fill="#2B1D14" />
      {/* glasses */}
      <rect x="236" y="232" width="38" height="28" rx="10" fill="#fff" fillOpacity=".15" stroke="#1E1B2E" strokeWidth="5" />
      <rect x="286" y="232" width="38" height="28" rx="10" fill="#fff" fillOpacity=".15" stroke="#1E1B2E" strokeWidth="5" />
      <path d="M274 244 h12" stroke="#1E1B2E" strokeWidth="4" />
      <circle cx="255" cy="246" r="4.5" fill="#1E1B2E" />
      <circle cx="305" cy="246" r="4.5" fill="#1E1B2E" />
      {/* smile */}
      <path d="M264 276 Q280 288 296 276" stroke="#7C2D12" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* laptop (back facing viewer) */}
      <rect x="196" y="336" width="168" height="104" rx="10" fill="#94A3B8" />
      <rect x="196" y="336" width="168" height="104" rx="10" fill="url(#hi-lid)" />
      <circle cx="280" cy="386" r="8" fill="#60A5FA" />
      <rect x="176" y="434" width="208" height="8" rx="4" fill="#CBD5E1" />
      {/* hands */}
      <ellipse cx="206" cy="434" rx="14" ry="8" fill="#C68B59" />
      <ellipse cx="354" cy="434" rx="14" ry="8" fill="#C68B59" />

      <defs>
        <linearGradient id="hi-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
