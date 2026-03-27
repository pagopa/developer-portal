import { buildEnv } from '@/lib/buildEnv';
import { WebinarCategory } from '@/lib/types/webinarCategory';
import { fetchWebinarCategories } from './fetcher';
import { mapWebinarCategoriesProps } from './mapper';

export const WebinarCategoriesRepository = {
  /**
   * Returns all webinar categories
   * @param locale The locale used to get the webinar categories.
   * @returns An array of webinar categories with all their fields.
   */
  getAll: async (locale: string): Promise<readonly WebinarCategory[]> => {
    const strapiWebinarCategories = await fetchWebinarCategories(
      locale,
      buildEnv
    );
    return mapWebinarCategoriesProps(strapiWebinarCategories);
  },
};
