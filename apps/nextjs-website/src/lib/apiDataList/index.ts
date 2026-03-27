import { fetchApiDataList, fetchProductApiDataReader } from './fetcher';
import { mapApiDataList } from './mapper';
import { ApiDataPageProps } from './types';

export const ApiDataListRepository = {
  /**
   * Returns all API Data pre-transformed and ready for UI
   * @param locale The locale used to get the API Data collection.
   * @returns An array of API Data entries with all their fields, ready for UI consumption.
   */
  getAll: async (locale: string): Promise<ReadonlyArray<ApiDataPageProps>> => {
    const rawData = await fetchApiDataList(locale);
    if (!rawData) {
      return [];
    }
    return mapApiDataList(locale, rawData);
  },
  /**
   * Returns API Data by looking up just the slug.
   * @param locale The locale used to get the API Data collection.
   * @param apiDataSlug The slug of the API Data to retrieve.
   * @returns The matching API Data entry, or `undefined` if no entry is found.
   */
  getBySlug: async (
    locale: string,
    apiDataSlug: string
  ): Promise<ApiDataPageProps | undefined> => {
    const all = await ApiDataListRepository.getAll(locale);
    return all.find((apiData) => apiData.apiDataSlug === apiDataSlug);
  },
  /**
   * Fetches API Data entries for a specific product.
   * Only retrieves 'updatedAt' and the slug from either 'apiRestDetail' or 'apiSoapDetail'.
   * @param locale The locale used to get the API Data collection.
   * @param productSlug The slug of the product to filter API Data by.
   * @returns An array of API Data entries related to the specified product.
   */
  getProductApiData: async (locale: string, productSlug: string) =>
    fetchProductApiDataReader(locale, productSlug),
};
