import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { fetchReleaseNotes } from './fetcher';
import { mapReleaseNotesProps } from './mapper';
import { getReleaseNotesMetadata } from '@/helpers/s3Metadata.helpers';
import { SUPPORTED_LOCALES } from '@/locales';

export const ReleaseNotesRepository = {
  /**
   * Returns all Release Note pages
   * @param locale The locale used to get the Release Note Page.
   * @returns An array of Release Note pages with all their fields, sorted by product name.
   */
  getAll: async (locale: string): Promise<readonly ReleaseNotePageProps[]> => {
    const strapiReleaseNotes = await fetchReleaseNotes(locale);
    return mapReleaseNotesProps(locale, strapiReleaseNotes);
  },
  /**
   * Returns a Release Note by its product slug
   * @param locale The locale used to get the Release Note Page.
   * @param productSlug The slug of the product to retrieve the Release Note Page for.
   * @returns The matching Release Note Page, or `undefined` if no entry is found.
   */
  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<ReleaseNotePageProps | undefined> => {
    const all = await ReleaseNotesRepository.getAll(locale);
    return all.find((releaseNote) => releaseNote.product.slug === productSlug);
  },
  getLocalizedPaths: async (
    currentLocale: string,
    releaseNote: ReleaseNotePageProps,
    currentPagePath: string
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!releaseNote.documentId) {
      return [];
    }

    const basePath = releaseNote.path;

    if (
      currentPagePath !== basePath &&
      !currentPagePath.startsWith(`${basePath}/`)
    ) {
      return [];
    }

    const relativePath = currentPagePath.slice(basePath.length);

    const translations = await Promise.all(
      SUPPORTED_LOCALES.filter(
        ({ langCode }) => langCode !== currentLocale
      ).map(async ({ langCode }) => {
        const releaseNotes = await ReleaseNotesRepository.getAll(langCode);

        const translatedReleaseNote = releaseNotes.find(
          ({ documentId }) => documentId === releaseNote.documentId
        );

        if (!translatedReleaseNote) {
          return null;
        }

        const translatedPath = `${translatedReleaseNote.path}${relativePath}`;

        const metadata = await getReleaseNotesMetadata(
          langCode,
          translatedReleaseNote.dirName
        );

        return metadata.some(({ path }) => path === translatedPath)
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
