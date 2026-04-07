import { buildEnv } from '@/lib/buildEnv';
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { fetchSolutionListPage } from './fetcher';
import { mapSolutionListPageProps } from './mapper';

export const SolutionListPageRepository = {
  get: async (locale: string): Promise<SolutionListTemplateProps> => {
    const strapiSolutionListPage = await fetchSolutionListPage(
      locale,
      buildEnv
    );
    return mapSolutionListPageProps(locale, strapiSolutionListPage);
  },
};
