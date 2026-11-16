import type { Config } from 'tailwindcss';

/** UniHub design tokens (see docs/ARCHITECTURE.md and the brand palette in the PRD). */
const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1240px' } },
    extend: {
      // All theme colours are CSS variables (see globals.css) so light/dark switch instantly.
      colors: {
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)", // blue accent (fills, CTAs)
          deep: "rgb(var(--brand-deep) / <alpha-value>)",
          light: "rgb(var(--brand-soft) / <alpha-value>)", // tinted background
          fg: "rgb(var(--brand-fg) / <alpha-value>)", // accent text/icons on surfaces (contrast-safe)
          on: "rgb(var(--brand-on) / <alpha-value>)", // text on blue fills
        },
        violet: { DEFAULT: "#7C3AED", light: "rgb(var(--violet-soft) / <alpha-value>)" },
        teal: { DEFAULT: "#14B8A6", light: "rgb(var(--teal-soft) / <alpha-value>)" },
        amber: { DEFAULT: "#F5B82E" },
        ink: { DEFAULT: "rgb(var(--ink) / <alpha-value>)", muted: "rgb(var(--ink-muted) / <alpha-value>)" },
        surface: { DEFAULT: "rgb(var(--surface) / <alpha-value>)", soft: "rgb(var(--surface-soft) / <alpha-value>)", raised: "rgb(var(--surface-raised) / <alpha-value>)" },
        page: "rgb(var(--page) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-arabic)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem' },
      keyframes: {
        'uh-rise': { from: { opacity: '0', transform: 'translateY(14px) scale(0.98)' }, to: { opacity: '1', transform: 'none' } },
        'uh-float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        'uh-shine': { from: { transform: 'translateX(-120%) skewX(-20deg)' }, to: { transform: 'translateX(320%) skewX(-20deg)' } },
        'uh-draw': { from: { strokeDashoffset: '260' }, to: { strokeDashoffset: '0' } },
        'uh-grow': { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        'uh-blink': { '0%, 92%, 100%': { transform: 'scaleY(1)' }, '95%': { transform: 'scaleY(0.1)' } },
        'uh-pop': { '0%, 12%': { opacity: '0', transform: 'translateY(6px) scale(0.9)' }, '20%, 80%': { opacity: '1', transform: 'none' }, '90%, 100%': { opacity: '0', transform: 'translateY(-4px)' } },
      },
      animation: {
        'uh-rise': 'uh-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'uh-float': 'uh-float 3.5s ease-in-out infinite',
        'uh-shine': 'uh-shine 0.9s ease-out',
        'uh-grow': 'uh-grow 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both',
        'uh-draw': 'uh-draw 1.6s ease-out 0.2s both',
        'uh-blink': 'uh-blink 4.5s ease-in-out infinite',
        'uh-pop': 'uh-pop 6s ease-in-out infinite',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
      },
    },
  },
  plugins: [],
};
export default config;
