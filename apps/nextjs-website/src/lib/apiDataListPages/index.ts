import { SUPPORTED_LOCALES } from '@/locales';
import { fetchApiDataListPages } from './fetcher';
import { mapApiDataListPages } from './mapper';
import { ApiDataListPageTemplateProps } from './types';

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
  getLocalizedPaths: async (
    currentLocale: string,
    page: ApiDataListPageTemplateProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!page.documentId) {
      return [];
    }

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const pages = await ApiDataListPagesRepository.getAll(langCode);

        const translatedPage = pages.find(
          ({ documentId }) => documentId === page.documentId
        );

        return translatedPage
          ? {
              langCode,
              path: `/${langCode}/${translatedPage.product.slug}/api`,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: `/${currentLocale}/${page.product.slug}/api`,
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
