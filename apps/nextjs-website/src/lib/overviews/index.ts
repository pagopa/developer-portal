import { buildEnv } from '@/lib/buildEnv';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { fetchOverviews } from './fetcher';
import { mapOverviewsProps } from './mapper';

export const OverviewsRepository = {
  /**
   * Returns all Overview pages
   * @param locale The locale used to get the Overview collection.
   * @returns An array of Overview pages with all their fields, sorted by product name.
   */
  getAll: async (locale: string): Promise<ReadonlyArray<OverviewPageProps>> => {
    const strapiOverviews = await fetchOverviews(locale, buildEnv);
    return mapOverviewsProps(locale, strapiOverviews);
  },
};
