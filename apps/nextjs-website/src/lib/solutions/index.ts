import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { fetchSolutions } from './fetcher';
import { mapSolutionsProps } from './mapper';
import { SUPPORTED_LOCALES } from '@/locales';
import { getSolutionsMetadata } from '@/helpers/s3Metadata.helpers';

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

  getLocalizedPaths: async (
    currentLocale: string,
    solution: SolutionTemplateProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!solution.documentId) {
      return [];
    }

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const solutions = await SolutionRepository.getAll(langCode);

        const translatedSolution = solutions.find(
          ({ documentId }) => documentId === solution.documentId
        );

        return translatedSolution
          ? {
              langCode,
              path: `/${langCode}/solutions/${translatedSolution.slug}`,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: `/${currentLocale}/solutions/${solution.slug}`,
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
  getLocalizedGitBookPaths: async (
    currentLocale: string,
    solution: SolutionTemplateProps,
    currentPagePath: string
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!solution.documentId || !currentPagePath) {
      return [];
    }

    const basePath = `/${currentLocale}/solutions/${solution.slug}/details`;

    if (
      currentPagePath !== basePath &&
      !currentPagePath.startsWith(`${basePath}/`)
    ) {
      return [];
    }

    const relativePath = currentPagePath.slice(basePath.length);

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const solutions = await SolutionRepository.getAll(langCode);

        const translatedSolution = solutions.find(
          ({ documentId }) => documentId === solution.documentId
        );

        if (!translatedSolution) {
          return null;
        }

        const translatedBasePath = `/${langCode}/solutions/${translatedSolution.slug}/details`;

        const translatedPath = `${translatedBasePath}${relativePath}`;

        const metadata = await getSolutionsMetadata(
          langCode,
          translatedSolution.dirName
        );

        return metadata.some(({ path }) => path === translatedPath)
          ? {
              langCode,
              path: translatedPath,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: currentPagePath,
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
