import { fetchApiDataList } from './fetcher';
import { mapApiDataList } from './mapper';
import { ApiDataPageProps } from './types';

export const ApiDataListRepository = {
  /**
   * Returns all API Data pre-transformed and ready for UI
   */
  getAll: async (locale: string): Promise<ReadonlyArray<ApiDataPageProps>> => {
    const rawData = await fetchApiDataList(locale);
    if (!rawData) {
      return [];
    }
    return mapApiDataList(locale, rawData);
  },

  /**
   * Returns API Data settings for a given product
   */
  getByProductAndSlug: async (
    locale: string,
    productSlug: string,
    apiDataSlug: string
  ): Promise<ApiDataPageProps | undefined> => {
    const all = await ApiDataListRepository.getAll(locale);
    return all.find(
      (apiData) =>
        apiData.product?.slug === productSlug &&
        apiData.apiDataSlug === apiDataSlug
    );
  },

  /**
   * Returns API Data by looking up just the slug.
   */
  getBySlug: async (
    locale: string,
    apiDataSlug: string
  ): Promise<ApiDataPageProps | undefined> => {
    const all = await ApiDataListRepository.getAll(locale);
    return all.find((apiData) => apiData.apiDataSlug === apiDataSlug);
  },
};
