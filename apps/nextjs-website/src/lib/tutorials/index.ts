import { isMarkDownPart } from '@/lib/parts/strapiTypes';
import { getMarkdownContentDict } from '@/helpers/s3Metadata.helpers';
import { fetchProductTutorialsReader, fetchTutorials } from './fetcher';
import { mapTutorialsProps } from './mapper';
import type { TutorialProps } from './strapiTypes';
import { SUPPORTED_LOCALES } from '@/locales';

export const TutorialRepository = {
  /**
   * Returns all tutorials pre-transformed and ready for UI
   * @param locale The locale used to get the tutorial collection.
   * @returns An array of tutorials with their content, ready for UI consumption.
   */
  getAll: async (locale: string): Promise<readonly TutorialProps[]> => {
    const strapiTutorials = await fetchTutorials(locale);
    const markdownParts = strapiTutorials.data.flatMap((tutorial) =>
      (tutorial?.parts ?? []).filter(isMarkDownPart)
    );
    const markdownContentDict = await getMarkdownContentDict(
      locale,
      markdownParts
    );

    return mapTutorialsProps(locale, strapiTutorials, markdownContentDict);
  },
  /**
   * Retrieves a tutorial matching the given path for the specified locale.
   * @param locale The locale used to get the tutorial collection.
   * @param path The tutorial path to match.
   * @returns The matching tutorial, or `undefined` if no tutorial is found.
   */
  getByPath: async (
    locale: string,
    path: string
  ): Promise<TutorialProps | undefined> => {
    const all = await TutorialRepository.getAll(locale);
    return all.find((tutorial) => tutorial.path === path);
  },
  /**
   * Fetches Tutorials for a specific product.
   * Only retrieves 'slug' and 'updatedAt' to build the sitemap URL.
   * @param locale The locale used to get the tutorial collection.
   * @param productSlug The slug of the product to filter tutorials by.
   * @returns An array of tutorials related to the specified product.
   */
  getProductTutorials: async (locale: string, productSlug: string) =>
    fetchProductTutorialsReader(locale, productSlug),
  getLocalizedPaths: async (
    currentLocale: string,
    tutorial: TutorialProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!tutorial.documentId) {
      return [];
    }

    const otherLocales = SUPPORTED_LOCALES.filter(
      ({ langCode }) => langCode !== currentLocale
    );

    const translations = await Promise.all(
      otherLocales.map(async ({ langCode }) => {
        const tutorials = await TutorialRepository.getAll(langCode);

        const translatedTutorial = tutorials.find(
          ({ documentId }) => documentId === tutorial.documentId
        );

        return translatedTutorial &&
          (!translatedTutorial.redirectPath ||
            translatedTutorial.redirectPath === translatedTutorial.path)
          ? {
              langCode,
              path: translatedTutorial.path,
            }
          : null;
      })
    );

    return [
      ...(!tutorial.redirectPath || tutorial.redirectPath === tutorial.path
        ? [{ langCode: currentLocale, path: tutorial.path }]
        : []),
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
