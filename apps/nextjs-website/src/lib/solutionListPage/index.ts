import { buildEnv } from '@/lib/buildEnv';
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { fetchSolutionListPage } from './fetcher';
import { mapSolutionListPageProps } from './mapper';

export const SolutionListPageRepository = {
  /**
   * Returns the Solution List Page for a given locale
   * @param locale The locale used to get the Solution List Page.
   * @returns The Solution List Page for the given locale.
   */
  get: async (locale: string): Promise<SolutionListTemplateProps> => {
    const strapiSolutionListPage = await fetchSolutionListPage(
      locale,
      buildEnv
    );
    return mapSolutionListPageProps(locale, strapiSolutionListPage);
  },
};
