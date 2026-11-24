import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { fetchReleaseNotes } from './fetcher';
import { mapReleaseNotesProps } from './mapper';
import { getReleaseNotesMetadata } from '@/helpers/s3Metadata.helpers';

import { getLocalizedGitBookPaths as resolveLocalizedGitBookPaths } from '@/helpers/localizedPaths.helpers';

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
  /**
   * Returns localized paths for a Release Note GitBook page, excluding unavailable translations.
   * @param currentLocale The locale of the current Release Note page.
   * @param releaseNote The Release Note associated with the current page.
   * @param currentPagePath The full path of the current GitBook page.
   * @returns Localized paths for the available translations, or an empty array if the document ID is missing.
   */
  getLocalizedPaths: async (
    currentLocale: string,
    releaseNote: ReleaseNotePageProps,
    currentPagePath: string
  ) =>
    resolveLocalizedGitBookPaths({
      currentLocale,
      currentItem: releaseNote,
      currentPagePath,
      getAll: ReleaseNotesRepository.getAll,
      getBasePath: (_locale, item) => item.path,
      getMetadataPaths: (locale, item) =>
        getReleaseNotesMetadata(locale, item.dirName),
    }),
};
