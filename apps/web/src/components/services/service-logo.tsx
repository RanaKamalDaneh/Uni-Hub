import {
  AlignLeft,
  ArrowRightLeft,
  BadgeCheck,
  BarChart3,
  Blocks,
  BookOpen,
  BookText,
  Bot,
  BrainCircuit,
  Briefcase,
  CircleHelp,
  ClipboardList,
  Cog,
  Compass,
  Database,
  FileBarChart,
  FileCheck,
  FileCheck2,
  FileCode2,
  FileSearch,
  FileText,
  FlaskConical,
  Gauge,
  GraduationCap,
  Languages,
  LayoutList,
  Library,
  Lightbulb,
  LineChart,
  Mic,
  Microscope,
  Network,
  Newspaper,
  PenLine,
  PencilRuler,
  Pickaxe,
  PieChart,
  Presentation,
  Quote,
  Router,
  ScanEye,
  ScanSearch,
  SearchCheck,
  Server,
  Shield,
  ShieldCheck,
  Sheet,
  Sigma,
  Smile,
  Sparkles,
  SpellCheck,
  SquareTerminal,
  Table2,
  Tags,
  Target,
  ThumbsUp,
  Video,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORY_TONES, CategoryIcon } from '@/components/category-icon';
import { SERVICE_VISUALS } from '@/lib/service-logos';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  AlignLeft, ArrowRightLeft, BadgeCheck, Blocks, BookOpen, BookText, Bot, BrainCircuit, Briefcase, CircleHelp,
  ClipboardList, Cog, Compass, Database, FileBarChart, FileCheck, FileCheck2, FileCode2, FileSearch, FileText,
  FlaskConical, Gauge, GraduationCap, Languages, LayoutList, Library, Lightbulb, LineChart, Mic, Microscope, Network,
  Newspaper, PenLine, PencilRuler, Pickaxe, PieChart, Presentation, Quote, ScanEye, ScanSearch, SearchCheck, Server,
  Shield, ShieldCheck, Sigma, Smile, Sparkles, SpellCheck, SquareTerminal, Table2, Tags, Target, ThumbsUp, Video,
  Workflow, Wrench,
};

// Brand colours for technologies shown with an icon rather than their trademark logo.
const BRANDS = {
  excel: { icon: Sheet, bg: 'bg-[#E8F5EE]', fg: 'text-[#217346]' },
  powerbi: { icon: BarChart3, bg: 'bg-[#FEF7D6]', fg: 'text-[#C9A400]' },
  tableau: { icon: PieChart, bg: 'bg-[#FDEEE3]', fg: 'text-[#E97627]' },
  cisco: { icon: Router, bg: 'bg-[#E3F4FA]', fg: 'text-[#1BA0D7]' },
} as const;

const SIZES = {
  md: { tile: 'h-12 w-12 rounded-2xl', img: 'h-7 w-7', icon: 'h-6 w-6', duo: 'h-6 w-6' },
  lg: { tile: 'h-16 w-16 rounded-2xl', img: 'h-10 w-10', icon: 'h-8 w-8', duo: 'h-8 w-8' },
};

/**
 * Service logo tile. Lifts and tilts on card hover (parent must have the `group` class);
 * `float` adds a gentle idle float, used on the service detail header.
 */
export function ServiceLogo({
  slug,
  category,
  size = 'md',
  float = false,
  className,
}: {
  slug: string;
  category: { icon: string; color: string };
  size?: keyof typeof SIZES;
  float?: boolean;
  className?: string;
}) {
  const v = SERVICE_VISUALS[slug];
  const s = SIZES[size];
  const tone = CATEGORY_TONES[category.color] ?? CATEGORY_TONES.blue;
  const motion = cn(
    'transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-lift',
    float && 'animate-uh-float',
  );

  if (!v) return <CategoryIcon icon={category.icon} color={category.color} className={cn(s.tile, motion, className)} />;

  if ('logos' in v) {
    const [a, b] = v.logos;
    return (
      <span className={cn('relative inline-flex shrink-0 items-center justify-center border border-line bg-white shadow-card', s.tile, motion, className)}>
        {b ? (
          <>
            <img src={`/logos/${a}.svg`} alt="" className={cn(s.duo, '-translate-x-1.5 -translate-y-1 object-contain')} />
            <img src={`/logos/${b}.svg`} alt="" className={cn(s.duo, 'absolute bottom-1.5 end-1.5 rounded-md bg-white object-contain p-0.5 shadow-sm')} />
          </>
        ) : (
          <img src={`/logos/${a}.svg`} alt="" className={cn(s.img, 'object-contain')} />
        )}
      </span>
    );
  }

  if ('brand' in v) {
    const br = BRANDS[v.brand];
    return (
      <span className={cn('inline-flex shrink-0 items-center justify-center', s.tile, br.bg, br.fg, motion, className)}>
        <br.icon className={s.icon} aria-hidden />
      </span>
    );
  }

  const Icon = ICONS[v.icon];
  if (!Icon) return <CategoryIcon icon={category.icon} color={category.color} className={cn(s.tile, motion, className)} />;
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', s.tile, tone.bg, tone.fg, motion, className)}>
      <Icon className={s.icon} aria-hidden />
    </span>
  );
}
