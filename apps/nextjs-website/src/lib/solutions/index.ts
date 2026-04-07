import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { fetchSolutions } from './fetcher';
import { mapSolutionsProps } from './mapper';

export const SolutionRepository = {
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<SolutionTemplateProps>> => {
    const strapiSolutions = await fetchSolutions(locale);
    return strapiSolutions ? mapSolutionsProps(locale, strapiSolutions) : [];
  },

  getBySlug: async (
    locale: string,
    slug: string
  ): Promise<SolutionTemplateProps | undefined> => {
    const all = await SolutionRepository.getAll(locale);
    return all.find((solution) => solution.slug === slug);
  },
};
