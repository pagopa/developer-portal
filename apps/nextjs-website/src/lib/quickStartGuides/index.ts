import { buildEnv } from '@/lib/buildEnv';
import { fetchQuickStartGuides } from './fetcher';
import { mapQuickStartGuidesProps } from './mapper';
import { QuickStartGuidePageProps } from '@/app/[locale]/[productSlug]/quick-start/page';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

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
  /**
   * Returns localized paths for a Quick Start Guide page.
   * @param currentLocale The locale of the current Quick Start Guide page.
   * @param quickStartGuide The current Quick Start Guide page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    quickStartGuide: QuickStartGuidePageProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: quickStartGuide,
      getAll: QuickStartGuidesRepository.getAll,
      getPath: (_locale, item) => item.path,
    }),
};
