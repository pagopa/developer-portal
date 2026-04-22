import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { fetchCaseHistories } from './fetcher';
import { mapCaseHistoriesProps } from './mapper';

export const CaseHistoriesRepository = {
  /**
   * Returns all Case History pages
   * @param locale The locale used to get the Case History collection.
   * @returns An array of Case History pages with all their fields, sorted by product name.
   */
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<CaseHistoryPageTemplateProps>> => {
    const strapiCaseHistories = await fetchCaseHistories(locale);
    return mapCaseHistoriesProps(strapiCaseHistories);
  },
};
