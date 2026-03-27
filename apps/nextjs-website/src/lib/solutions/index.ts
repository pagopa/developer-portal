import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { fetchSolutions } from './fetcher';
import { mapSolutionsProps } from './mapper';

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
};
