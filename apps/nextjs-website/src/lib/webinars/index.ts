import { buildEnv } from '@/lib/buildEnv';
import type { Webinar } from '@/lib/webinars/types';
import { fetchWebinars } from './fetcher';
import { mapWebinarsProps } from './mapper';
import { SUPPORTED_LOCALES } from '@/locales';

export const WebinarsRepository = {
  /**
   * Returns all webinars
   * @param locale The locale used to get the webinars.
   * @returns An array of webinars with all their fields.
   */
  getAll: async (locale: string): Promise<readonly Webinar[]> => {
    const strapiWebinars = await fetchWebinars(locale, buildEnv);
    return mapWebinarsProps(strapiWebinars);
  },
  /**
   * Returns a webinar by its slug
   * @param locale The locale used to get the webinars.
   * @param webinarSlug The slug of the webinar to retrieve.
   * @returns The matching webinar, or `undefined` if no entry is found.
   */
  getBySlug: async (
    locale: string,
    webinarSlug: string
  ): Promise<Webinar | undefined> => {
    const all = await WebinarsRepository.getAll(locale);
    return all.find((webinar) => webinar.slug === webinarSlug);
  },
  getLocalizedPaths: async (
    currentLocale: string,
    webinar: Webinar
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!webinar.documentId) {
      return [];
    }

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const webinars = await WebinarsRepository.getAll(langCode);

        const translatedWebinar = webinars.find(
          ({ documentId }) => documentId === webinar.documentId
        );

        return translatedWebinar
          ? {
              langCode,
              path: `/${langCode}/webinars/${translatedWebinar.slug}`,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: `/${currentLocale}/webinars/${webinar.slug}`,
      },
      ...translations.filter(
        (
          translation
        ): translation is {
          readonly langCode: string;
          readonly path: string;
        } => translation !== null
      ),
    ];
  },
};
