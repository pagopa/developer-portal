import { SUPPORTED_LOCALES } from '@/locales';
import { fetchApiDataList, fetchProductApiData } from './fetcher';
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
   * Returns API Data by matching its product and API slugs.
   * @param locale The locale used to get the API Data collection.
   * @param productSlug The slug of the product that owns the API Data.
   * @param apiDataSlug The slug of the API Data to retrieve.
   * @returns The matching API Data entry, or `undefined` if no entry is found.
   */
  getByProductAndSlug: async (
    locale: string,
    productSlug: string,
    apiDataSlug: string
  ): Promise<ApiDataPageProps | undefined> => {
    const all = await ApiDataListRepository.getAll(locale);
    return all.find(
      (apiData) =>
        apiData.apiDataSlug === apiDataSlug &&
        apiData.product?.slug === productSlug
    );
  },
  /**
   * Fetches API Data entries for a specific product.
   * Only retrieves 'updatedAt' and the slug from either 'apiRestDetail' or 'apiSoapDetail'.
   * @param locale The locale used to get the API Data collection.
   * @param productSlug The slug of the product to filter API Data by.
   * @returns An array of API Data entries related to the specified product.
   */
  getProductApiData: async (locale: string, productSlug: string) =>
    fetchProductApiData(locale, productSlug),
  getLocalizedPaths: async (
    currentLocale: string,
    page: ApiDataPageProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!page.documentId || !page.product?.slug) {
      return [];
    }

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const pages = await ApiDataListRepository.getAll(langCode);

        const translatedPage = pages.find(
          ({ documentId }) => documentId === page.documentId
        );

        if (!translatedPage?.product?.slug) {
          return null;
        }

        return {
          langCode,
          path: `/${langCode}/${translatedPage.product.slug}/api/${translatedPage.apiDataSlug}`,
        };
      })
    );

    return [
      {
        langCode: currentLocale,
        path: `/${currentLocale}/${page.product.slug}/api/${page.apiDataSlug}`,
      },
      ...translations.filter(
        (
          translation
        ): translation is {
          readonly langCode: string;
          readonly path: string;
        } => translation !== null
      ),
    ];
  },
};
