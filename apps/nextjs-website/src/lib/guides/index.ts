import type { Guide } from './types';
import { fetchGuides } from './fetcher';
import { mapGuides } from './mapper';
import { getGuidesMetadata } from '@/helpers/s3Metadata.helpers';
import { SUPPORTED_LOCALES } from '@/locales';

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
  getLocalizedPaths: async (
    currentLocale: string,
    guide: Pick<Guide, 'documentId'>,
    currentPagePath: string,
    currentPathPrefix: string,
    currentVersion: {
      readonly main: boolean;
      readonly name: string;
    }
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!guide.documentId) {
      return [];
    }

    const relativePath = currentPagePath.startsWith(currentPathPrefix)
      ? currentPagePath.slice(currentPathPrefix.length)
      : undefined;

    if (relativePath === undefined) {
      return [];
    }

    const otherLocales = SUPPORTED_LOCALES.filter(
      ({ langCode }) => langCode !== currentLocale
    );

    const translations = await Promise.all(
      otherLocales.map(async ({ langCode }) => {
        const guides = await GuidesRepository.getAll(langCode);

        const translatedGuide = guides.find(
          ({ documentId }) => documentId === guide.documentId
        );

        if (!translatedGuide?.guide.slug) {
          return null;
        }

        const translatedVersion = translatedGuide.versions.find(
          ({ main, version }) =>
            currentVersion.main
              ? main === true
              : version === currentVersion.name
        );

        if (!translatedVersion) {
          return null;
        }

        const basePath = `/${langCode}/${translatedGuide.product.slug}/guides/${translatedGuide.guide.slug}`;

        const pathPrefix = translatedVersion.main
          ? basePath
          : `${basePath}/${translatedVersion.version}`;

        const translatedPath = `${pathPrefix}${relativePath}`;

        const pages = await getGuidesMetadata(
          langCode,
          translatedVersion.dirName
        );

        return pages.some(({ path }) => path === translatedPath)
          ? {
              langCode,
              path: translatedPath,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: currentPagePath,
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
