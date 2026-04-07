import { GuideListPageProps } from '@/app/[locale]/[productSlug]/guides/page';
import { fetchGuideListPages } from './fetcher';
import { mapGuideListPages } from './mapper';

export const GuideListPagesRepository = {
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<GuideListPageProps>> => {
    const rawData = await fetchGuideListPages(locale);
    if (!rawData) {
      return [];
    }
    return mapGuideListPages(locale, rawData);
  },

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
