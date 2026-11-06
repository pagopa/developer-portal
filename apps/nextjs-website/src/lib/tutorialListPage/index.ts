import { buildEnv } from '@/lib/buildEnv';
import { TutorialsPageProps } from '@/app/[locale]/[productSlug]/tutorials/page';
import { fetchTutorialListPages } from './fetcher';
import { mapTutorialListPageProps } from './mapper';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

export const TutorialListPageRepository = {
  /**
   * Returns all Tutorial List pages
   * @param locale The locale used to get the Tutorial List pages.
   * @returns An array of Tutorial List pages with all their fields, sorted by product name.
   */
  getAll: async (locale: string): Promise<readonly TutorialsPageProps[]> => {
    const strapiTutorialListPages = await fetchTutorialListPages(
      locale,
      buildEnv
    );

    return mapTutorialListPageProps(locale, strapiTutorialListPages);
  },
  /**
   * Returns a Tutorial List page by its product slug
   * @param locale The locale used to get the Tutorial List pages.
   * @param productSlug The slug of the product to retrieve the Tutorial List page for.
   * @returns The matching Tutorial List page, or `undefined` if no entry is found.
   */
  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<TutorialsPageProps | undefined> => {
    const all = await TutorialListPageRepository.getAll(locale);
    return all.find(
      (tutorialListPage) => tutorialListPage.product.slug === productSlug
    );
  },
  /**
   * Returns localized paths for a Tutorial List page.
   * @param currentLocale The locale of the current Tutorial List page.
   * @param tutorialListPage The current Tutorial List page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    tutorialListPage: TutorialsPageProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: tutorialListPage,
      getAll: TutorialListPageRepository.getAll,
      getPath: (_locale, item) => item.path,
    }),
};
