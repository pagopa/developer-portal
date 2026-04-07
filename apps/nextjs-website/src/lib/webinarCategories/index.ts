import { buildEnv } from '@/lib/buildEnv';
import { WebinarCategory } from '@/lib/types/webinarCategory';
import { fetchWebinarCategories } from './fetcher';
import { mapWebinarCategoriesProps } from './mapper';

export const WebinarCategoriesRepository = {
  getAll: async (locale: string): Promise<readonly WebinarCategory[]> => {
    const strapiWebinarCategories = await fetchWebinarCategories(
      locale,
      buildEnv
    );

    return mapWebinarCategoriesProps(strapiWebinarCategories);
  },
};
