import { buildEnv } from '@/lib/buildEnv';
import { Webinar } from '@/lib/types/webinar';
import { fetchWebinars } from './fetcher';
import { mapWebinarsProps } from './mapper';

export const WebinarsRepository = {
  getAll: async (locale: string): Promise<readonly Webinar[]> => {
    const strapiWebinars = await fetchWebinars(locale, buildEnv);
    return mapWebinarsProps(strapiWebinars);
  },

  getBySlug: async (
    locale: string,
    webinarSlug: string
  ): Promise<Webinar | undefined> => {
    const all = await WebinarsRepository.getAll(locale);
    return all.find((webinar) => webinar.slug === webinarSlug);
  },
};
