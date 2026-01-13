/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !['en', 'it'].includes(locale)) {
    locale = 'it';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
