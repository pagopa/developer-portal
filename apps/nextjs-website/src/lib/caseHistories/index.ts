import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { fetchCaseHistories } from './fetcher';
import { mapCaseHistoriesProps } from './mapper';

export const CaseHistoriesRepository = {
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<CaseHistoryPageTemplateProps>> => {
    const strapiCaseHistories = await fetchCaseHistories(locale);
    return mapCaseHistoriesProps(strapiCaseHistories);
  },
};
