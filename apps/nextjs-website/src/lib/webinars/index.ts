import { buildEnv } from '@/lib/buildEnv';
import { Webinar } from '@/lib/types/webinar';
import { fetchWebinars } from './fetcher';
import { mapWebinarsProps } from './mapper';

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
};
