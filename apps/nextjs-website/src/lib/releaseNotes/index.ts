import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { fetchReleaseNotes } from './fetcher';
import { mapReleaseNotesProps } from './mapper';

export const ReleaseNotesRepository = {
  getAll: async (locale: string): Promise<readonly ReleaseNotePageProps[]> => {
    const strapiReleaseNotes = await fetchReleaseNotes(locale);
    return mapReleaseNotesProps(locale, strapiReleaseNotes);
  },

  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<ReleaseNotePageProps | undefined> => {
    const all = await ReleaseNotesRepository.getAll(locale);
    return all.find((releaseNote) => releaseNote.product.slug === productSlug);
  },
};
