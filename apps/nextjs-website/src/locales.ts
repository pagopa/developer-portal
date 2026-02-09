import { isProduction } from '@/config';

export const SUPPORTED_LOCALES = [
  {
    code: 'it',
    label: 'IT',
  },
  // TODO: Remove this condition when the English version of the website will be ready to be published in production
  ...(isProduction ? [] : [{ code: 'en', label: 'EN' }]),
];
