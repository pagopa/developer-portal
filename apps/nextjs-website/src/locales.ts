export type Locale = {
  readonly langCode: string;
  readonly locale: string;
  readonly label: string;
};

export const SUPPORTED_LOCALES: readonly Locale[] = [
  {
    langCode: 'en',
    locale: 'en-US',
    label: 'EN',
  },
  {
    langCode: 'it',
    locale: 'it-IT',
    label: 'IT',
  },
];
