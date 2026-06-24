import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { fetchReleaseNotes } from './fetcher';
import { mapReleaseNotesProps } from './mapper';

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
};
