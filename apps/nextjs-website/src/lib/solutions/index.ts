import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { fetchSolutions } from './fetcher';
import { mapSolutionsProps } from './mapper';
import { getSolutionsMetadata } from '@/helpers/s3Metadata.helpers';

import {
  getLocalizedPaths as resolveLocalizedPaths,
  getLocalizedGitBookPaths as resolveLocalizedGitBookPaths,
} from '@/helpers/localizedPaths.helpers';

export const SolutionRepository = {
  /**
   * Returns all Solution pages
   * @param locale The locale used to get the Solution collection.
   * @returns An array of Solution pages with all their fields, sorted by product name.
   */
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<SolutionTemplateProps>> => {
    const strapiSolutions = await fetchSolutions(locale);
    return strapiSolutions ? mapSolutionsProps(locale, strapiSolutions) : [];
  },
  /**
   * Returns a Solution page by its slug
   * @param locale The locale used to get the Solution collection.
   * @param slug The slug of the Solution to retrieve.
   * @returns The matching Solution page, or `undefined` if no entry is found.
   */
  getBySlug: async (
    locale: string,
    slug: string
  ): Promise<SolutionTemplateProps | undefined> => {
    const all = await SolutionRepository.getAll(locale);
    return all.find((solution) => solution.slug === slug);
  },
  /**
   * Returns localized paths for the main Solution page.
   * @param currentLocale The locale of the current Solution.
   * @param solution The current Solution.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    solution: SolutionTemplateProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: solution,
      getAll: SolutionRepository.getAll,
      getPath: (locale, item) => `/${locale}/solutions/${item.slug}`,
    }),
  /**
   * Returns localized paths for a Solution GitBook page, excluding unavailable translations.
   * @param currentLocale The locale of the current Solution GitBook page.
   * @param solution The Solution associated with the current page.
   * @param currentPagePath The full path of the current GitBook page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedGitBookPaths: async (
    currentLocale: string,
    solution: SolutionTemplateProps,
    currentPagePath: string
  ) =>
    resolveLocalizedGitBookPaths({
      currentLocale,
      currentItem: solution,
      currentPagePath,
      getAll: SolutionRepository.getAll,
      getBasePath: (locale, item) =>
        `/${locale}/solutions/${item.slug}/details`,
      getMetadataPaths: (locale, item) =>
        getSolutionsMetadata(locale, item.dirName),
    }),
};
