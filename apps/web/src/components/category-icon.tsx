import {
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
  FileText,
  GraduationCap,
  Layers,
  Network,
  Presentation,
  Rocket,
  ScanSearch,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  Code2,
  BrainCircuit,
  BarChart3,
  Database,
  GraduationCap,
  Rocket,
  FileText,
  Network,
  Presentation,
  ScanSearch,
};

/** Category accent colours from the brand spec (Programming = blue, AI = violet, …). */
export const CATEGORY_TONES: Record<string, { bg: string; fg: string; ring: string; hero: string; solid: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', fg: 'text-blue-600 dark:text-blue-300', ring: 'group-hover:ring-blue-200 dark:group-hover:ring-blue-500/20', hero: 'from-blue-50 dark:from-blue-500/10', solid: 'bg-blue-600' },
  violet: { bg: 'bg-violet-light', fg: 'text-violet dark:text-violet-300', ring: 'group-hover:ring-violet-200 dark:group-hover:ring-violet-500/20', hero: 'from-violet-light', solid: 'bg-violet' },
  teal: { bg: 'bg-teal-light', fg: 'text-teal-700 dark:text-teal-300', ring: 'group-hover:ring-teal-200 dark:group-hover:ring-teal-500/20', hero: 'from-teal-light/70', solid: 'bg-teal' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', fg: 'text-indigo-600 dark:text-indigo-300', ring: 'group-hover:ring-indigo-200 dark:group-hover:ring-indigo-500/20', hero: 'from-indigo-50 dark:from-indigo-500/10', solid: 'bg-indigo-600' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', fg: 'text-purple-600 dark:text-purple-300', ring: 'group-hover:ring-purple-200 dark:group-hover:ring-purple-500/20', hero: 'from-purple-50 dark:from-purple-500/10', solid: 'bg-purple-600' },
  royal: { bg: 'bg-brand-light', fg: 'text-brand-fg', ring: 'group-hover:ring-brand/25', hero: 'from-brand-light', solid: 'bg-brand' },
  orange: { bg: 'bg-amber-50 dark:bg-amber-500/10', fg: 'text-amber-600 dark:text-amber-300', ring: 'group-hover:ring-amber-200 dark:group-hover:ring-amber-500/20', hero: 'from-amber-50 dark:from-amber-500/10', solid: 'bg-amber' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-500/10', fg: 'text-cyan-600 dark:text-cyan-300', ring: 'group-hover:ring-cyan-200 dark:group-hover:ring-cyan-500/20', hero: 'from-cyan-50 dark:from-cyan-500/10', solid: 'bg-cyan-600' },
  green: { bg: 'bg-green-50 dark:bg-green-500/10', fg: 'text-green-600 dark:text-green-300', ring: 'group-hover:ring-green-200 dark:group-hover:ring-green-500/20', hero: 'from-green-50 dark:from-green-500/10', solid: 'bg-green-600' },
};

export function CategoryIcon({ icon, color, className }: { icon: string; color: string; className?: string }) {
  const Icon = ICONS[icon] ?? Layers;
  const tone = CATEGORY_TONES[color] ?? CATEGORY_TONES.blue;
  return (
    <span className={cn('inline-flex h-12 w-12 items-center justify-center rounded-2xl', tone.bg, tone.fg, className)}>
      <Icon className="h-6 w-6" aria-hidden />
    </span>
  );
}
