import { buildEnv } from '@/lib/buildEnv';
import { HomepageProps } from '@/app/[locale]/page';
import { fetchHomepage } from './fetcher';
import { mapHomepageProps } from './mapper';

export const HomepageRepository = {
  get: async (locale: string): Promise<HomepageProps> => {
    const strapiHomepage = await fetchHomepage(locale, buildEnv);
    return mapHomepageProps(locale, strapiHomepage);
  },
};
