import { GuideListPageProps } from '@/app/[locale]/[productSlug]/guides/page';
import { fetchGuideListPages } from './fetcher';
import { mapGuideListPages } from './mapper';

export const GuideListPagesRepository = {
  /**
   * Returns all Guide List pages
   * @param locale The locale used to get the Guide List Page collection.
   * @returns An array of Guide List pages with all their fields, sorted by product name.
   */
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<GuideListPageProps>> => {
    const rawData = await fetchGuideListPages(locale);
    if (!rawData) {
      return [];
    }
    return mapGuideListPages(locale, rawData);
  },
  /**
   * Returns Guide List Page settings for a given product
   * @param locale The locale used to get the Guide List Page collection.
   * @param productSlug The slug of the product to retrieve Guide List Page settings for.
   * @returns The matching Guide List Page settings, or `undefined` if no entry is found.
   */
  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<GuideListPageProps | undefined> => {
    const all = await GuideListPagesRepository.getAll(locale);
    return all.find(
      (guideListPage) => guideListPage.product.slug === productSlug
    );
  },
};
