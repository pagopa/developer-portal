import { buildEnv } from '@/lib/buildEnv';
import { TutorialsPageProps } from '@/app/[locale]/[productSlug]/tutorials/page';
import { fetchTutorialListPages } from './fetcher';
import { mapTutorialListPageProps } from './mapper';

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
};
