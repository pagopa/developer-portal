export const locales = ['it', 'en'] as const;
export const defaultLocale = 'it' as const;

export type Locale = (typeof locales)[number];

export const pathnames = {
  '/': '/',
  '/profile': '/profile',
  '/webinars': '/webinars',
  '/solutions': '/solutions',
} as const;