import { fetchApiDataListPages } from './fetcher';
import { mapApiDataListPages } from './mapper';
import { ApiDataListPageTemplateProps } from './types';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

export const ApiDataListPagesRepository = {
  /**
   * Returns all API Data List pages
   * @param locale The locale used to get the API Data List Page collection.
   * @returns An array of API Data List pages with all their fields, sorted by product name.
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
   * @param locale The locale used to get the API Data List Page collection.
   * @param productSlug The slug of the product to retrieve API Data List Page settings for.
   * @returns The matching API Data List Page settings, or `undefined` if no entry is found.
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
  /**
   * Returns localized paths for an API Data List page.
   * @param currentLocale The locale of the current API Data List page.
   * @param page The current API Data List page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    page: ApiDataListPageTemplateProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: page,
      getAll: ApiDataListPagesRepository.getAll,
      getPath: (locale, item) => `/${locale}/${item.product.slug}/api`,
    }),
};
