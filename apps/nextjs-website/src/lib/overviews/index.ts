import { buildEnv } from '@/lib/buildEnv';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { fetchOverviews } from './fetcher';
import { mapOverviewsProps } from './mapper';
import { SUPPORTED_LOCALES } from '@/locales';

export const OverviewsRepository = {
  /**
   * Returns all Overview pages
   * @param locale The locale used to get the Overview collection.
   * @returns An array of Overview pages with all their fields, sorted by product name.
   */
  getAll: async (locale: string): Promise<ReadonlyArray<OverviewPageProps>> => {
    const strapiOverviews = await fetchOverviews(locale, buildEnv);
    return mapOverviewsProps(locale, strapiOverviews);
  },
  getLocalizedPaths: async (
    currentLocale: string,
    overview: OverviewPageProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!overview.documentId) {
      return [];
    }

    const otherLocales = SUPPORTED_LOCALES.filter(
      ({ langCode }) => langCode !== currentLocale
    );

    const translations = await Promise.all(
      otherLocales.map(async ({ langCode }) => {
        const overviews = await OverviewsRepository.getAll(langCode);

        const translatedOverview = overviews.find(
          ({ documentId }) => documentId === overview.documentId
        );

        return translatedOverview
          ? {
              langCode,
              path: translatedOverview.path,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: overview.path,
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
