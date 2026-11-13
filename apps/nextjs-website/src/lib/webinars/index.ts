import { buildEnv } from '@/lib/buildEnv';
import type { Webinar } from '@/lib/webinars/types';
import { fetchWebinars } from './fetcher';
import { mapWebinarsProps } from './mapper';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

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
  /**
   * Returns localized paths for a Webinar.
   * @param currentLocale The locale of the current Webinar.
   * @param webinar The current Webinar.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (currentLocale: string, webinar: Webinar) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: webinar,
      getAll: WebinarsRepository.getAll,
      getPath: (locale, item) => `/${locale}/webinars/${item.slug}`,
    }),
};
