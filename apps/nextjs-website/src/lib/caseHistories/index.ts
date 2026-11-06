import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { fetchCaseHistories } from './fetcher';
import { mapCaseHistoriesProps } from './mapper';
import { SUPPORTED_LOCALES } from '@/locales';

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
  getLocalizedPaths: async (
    currentLocale: string,
    caseHistory: CaseHistoryPageTemplateProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!caseHistory.documentId) {
      return [];
    }

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const caseHistories = await CaseHistoriesRepository.getAll(langCode);

        const translatedCaseHistory = caseHistories.find(
          ({ documentId }) => documentId === caseHistory.documentId
        );

        return translatedCaseHistory
          ? {
              langCode,
              path: `/${langCode}/case-histories/${translatedCaseHistory.slug}`,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: `/${currentLocale}/case-histories/${caseHistory.slug}`,
      },
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
