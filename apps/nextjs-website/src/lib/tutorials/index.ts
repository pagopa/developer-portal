import { isMarkDownPart } from '@/lib/parts/types';
import { getMarkdownContentDict } from '@/helpers/s3Metadata.helpers';
import { fetchProductTutorialsReader, fetchTutorials } from './fetcher';
import { mapTutorialsProps } from './mapper';
import { TutorialProps } from './types';

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
};
