import { SUPPORTED_LOCALES } from '@/locales';
import type { StrapiEnv } from '@/lib/strapi/strapiEnv';
import { hasPublishedSingleType } from './hasPublishedSingleType';

export const getAvailableSingleTypeLocales = async (
  contentType: string,
  currentLocale: string,
  strapiEnv: StrapiEnv
): Promise<readonly string[]> => {
  const otherLocales = SUPPORTED_LOCALES.filter(
    ({ langCode }) => langCode !== currentLocale
  );

  const availableLocales = await Promise.all(
    otherLocales.map(async ({ langCode }) => ({
      langCode,
      available: await hasPublishedSingleType(contentType, langCode, strapiEnv),
    }))
  );

  return [
    currentLocale,
    ...availableLocales
      .filter(({ available }) => available)
      .map(({ langCode }) => langCode),
  ];
};
