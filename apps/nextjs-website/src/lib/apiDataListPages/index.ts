import { fetchApiDataListPages } from './fetcher';
import { mapApiDataListPages } from './mapper';
import { ApiDataListPageTemplateProps } from './types';

export const ApiDataListPagesRepository = {
  /**
   * Returns all API Data List pages
   */
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<ApiDataListPageTemplateProps>> => {
    const rawData = await fetchApiDataListPages(locale);
    if (!rawData) {
      return [];
    }
    return mapApiDataListPages(locale, rawData);
  },

  /**
   * Returns API Data List Page settings for a given product
   */
  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<ApiDataListPageTemplateProps | undefined> => {
    const all = await ApiDataListPagesRepository.getAll(locale);
    return all.find(
      (apiDataListPage) => apiDataListPage.product.slug === productSlug
    );
  },
};
