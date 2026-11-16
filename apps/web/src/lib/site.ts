/** Public origin of the website, used for canonical URLs, the sitemap and share previews. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
