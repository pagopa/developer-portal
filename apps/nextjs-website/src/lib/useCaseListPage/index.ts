import { buildEnv } from '@/lib/buildEnv';
import { UseCasesPageProps } from '@/app/[locale]/[productSlug]/use-cases/page';
import { fetchUseCaseListPages } from './fetcher';
import { mapUseCaseListPageProps } from './mapper';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

export const UseCaseListPageRepository = {
  /**
   * Returns all Use Case List pages
   * @param locale The locale used to get the Use Case List pages.
   * @returns An array of Use Case List pages with all their fields, sorted by product name.
   */
  getAll: async (locale: string): Promise<readonly UseCasesPageProps[]> => {
    const strapiUseCaseListPages = await fetchUseCaseListPages(
      locale,
      buildEnv
    );
    return mapUseCaseListPageProps(locale, strapiUseCaseListPages);
  },
  /**
   * Returns a Use Case List page by its product slug
   * @param locale The locale used to get the Use Case List pages.
   * @param productSlug The slug of the product to retrieve the Use Case List page for.
   * @returns The matching Use Case List page, or `undefined` if no entry is found.
   */
  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<UseCasesPageProps | undefined> => {
    const all = await UseCaseListPageRepository.getAll(locale);
    return all.find(
      (useCaseListPage) => useCaseListPage.product.slug === productSlug
    );
  },
  /**
   * Returns localized paths for a Use Case List page.
   * @param currentLocale The locale of the current Use Case List page.
   * @param useCaseListPage The current Use Case List page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    useCaseListPage: UseCasesPageProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: useCaseListPage,
      getAll: UseCaseListPageRepository.getAll,
      getPath: (_locale, item) => item.path,
    }),
};
