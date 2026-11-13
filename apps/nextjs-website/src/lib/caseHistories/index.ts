import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { fetchCaseHistories } from './fetcher';
import { mapCaseHistoriesProps } from './mapper';

import { getLocalizedPaths as resolveLocalizedPaths } from '@/helpers/localizedPaths.helpers';

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
  /**
   * Returns localized paths for a Case History.
   * @param currentLocale The locale of the current Case History.
   * @param caseHistory The current Case History.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    caseHistory: CaseHistoryPageTemplateProps
  ) =>
    resolveLocalizedPaths({
      currentLocale,
      currentItem: caseHistory,
      getAll: CaseHistoriesRepository.getAll,
      getPath: (locale, item) => `/${locale}/case-histories/${item.slug}`,
    }),
};
