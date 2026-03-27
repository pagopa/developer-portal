import { buildEnv } from '@/lib/buildEnv';
import { HomepageProps } from '@/app/[locale]/page';
import { fetchHomepage } from './fetcher';
import { mapHomepageProps } from './mapper';

export const HomepageRepository = {
  /**
   * Returns the homepage settings for a given locale
   * @param locale The locale used to get the homepage settings.
   * @returns The homepage settings for the given locale.
   */
  get: async (locale: string): Promise<HomepageProps> => {
    const strapiHomepage = await fetchHomepage(locale, buildEnv);
    return mapHomepageProps(locale, strapiHomepage);
  },
};
