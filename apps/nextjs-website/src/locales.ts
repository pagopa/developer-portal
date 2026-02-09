import { isProduction } from '@/config';

export const SUPPORTED_LOCALES = [
  {
    code: 'it',
    label: 'IT',
  },
  ...(isProduction ? [] : [{ code: 'en', label: 'EN' }]),
];
