import { buildEnv } from '@/lib/buildEnv';
import { fetchQuickStartGuides } from './fetcher';
import { mapQuickStartGuidesProps } from './mapper';
import { QuickStartGuidePageProps } from '@/app/[locale]/[productSlug]/quick-start/page';

export const QuickStartGuidesRepository = {
  /**
   * Returns all Quick Start Guide pages
   * @param locale The locale used to get the Quick Start Guide collection.
   * @returns An array of Quick Start Guide pages with all their fields, sorted by product name.
   */
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<QuickStartGuidePageProps>> => {
    const strapiQuickStartGuides = await fetchQuickStartGuides(
      locale,
      buildEnv
    );
    return mapQuickStartGuidesProps(locale, strapiQuickStartGuides);
  },
  /**
   * Returns a Quick Start Guide by its product slug
   * @param locale The locale used to get the Quick Start Guide collection.
   * @param productSlug The slug of the product to retrieve the Quick Start Guide for.
   * @returns The matching Quick Start Guide, or `undefined` if no entry is found.
   */
  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<QuickStartGuidePageProps | undefined> => {
    const all = await QuickStartGuidesRepository.getAll(locale);
    return all.find(
      (quickStartGuide) => quickStartGuide.product.slug === productSlug
    );
  },
};
