export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'en';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const ROLE_KEYS = ['STUDENT', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'FINANCE', 'MODERATOR'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const CATEGORY_COLORS = ['blue', 'violet', 'teal', 'indigo', 'purple', 'royal', 'orange', 'cyan', 'green'] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const UPLOAD_LIMITS = {
  maxBytes: 25 * 1024 * 1024,
  academicMaxBytes: 15 * 1024 * 1024,
  academicMimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
} as const;

export const DEFAULT_CURRENCY = 'JOD';
