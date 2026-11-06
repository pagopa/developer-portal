import { buildEnv } from '@/lib/buildEnv';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { fetchOverviews } from './fetcher';
import { mapOverviewsProps } from './mapper';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

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
  /**
   * Returns localized paths for a product Overview page.
   * @param currentLocale The locale of the current Overview page.
   * @param overview The current Overview page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    overview: OverviewPageProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: overview,
      getAll: OverviewsRepository.getAll,
      getPath: (_locale, item) => item.path,
    }),
};
