import { isProduction } from '@/config';

export type Locale = {
  readonly langCode: string;
  readonly locale: string;
  readonly label: string;
};

export const SUPPORTED_LOCALES: readonly Locale[] = [
  {
    langCode: 'it',
    locale: 'it-IT',
    label: 'IT',
  },
  ...(isProduction
    ? []
    : [
        {
          langCode: 'en',
          locale: 'en-EN',
          label: 'EN',
        },
      ]),
];
