import { Guide } from './types';
import { fetchGuides } from './fetcher';
import { mapGuides } from './mapper';

export const GuidesRepository = {
  /**
   * Returns all Guides
   * @param locale The locale used to get the Guides collection.
   * @returns An array of Guides with all their fields, sorted by product name.
   */
  getAll: async (locale: string): Promise<ReadonlyArray<Guide>> => {
    const rawData = await fetchGuides(locale);
    if (!rawData) {
      return [];
    }
    return mapGuides(locale, rawData);
  },
  /**
   * Returns a Guide by its slug
   * @param locale The locale used to get the Guides collection.
   * @param guideSlug The slug of the guide to retrieve.
   * @returns The matching Guide, or `undefined` if no entry is found.
   */
  getBySlug: async (
    locale: string,
    guideSlug: string
  ): Promise<Guide | undefined> => {
    const all = await GuidesRepository.getAll(locale);
    return all.find((guide) => guide.guide.slug === guideSlug);
  },
  /**
   * Returns a Guide by its product slug and guide slug
   * @param locale The locale used to get the Guides collection.
   * @param productSlug The slug of the product to retrieve the guide for.
   * @param guideSlug The slug of the guide to retrieve.
   * @returns The matching Guide, or `undefined` if no entry is found.
   */
  getByProductAndSlug: async (
    locale: string,
    productSlug: string,
    guideSlug: string
  ): Promise<Guide | undefined> => {
    const all = await GuidesRepository.getAll(locale);
    return all.find(
      (guide) =>
        guide.guide.slug === guideSlug && guide.product.slug === productSlug
    );
  },
};
