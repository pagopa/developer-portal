import { fetchResponseFromCDN } from '@/helpers/s3Metadata.helpers';
import { getSyncedReleaseNotesResponseJsonFile } from 'gitbook-docs/syncedResponses';
import { StrapiReleaseNotes } from './types';

export const fetchReleaseNotes = async (
  locale: string
): Promise<StrapiReleaseNotes> => {
  const strapiReleaseNotes = (await fetchResponseFromCDN(
    `${locale}/${getSyncedReleaseNotesResponseJsonFile}`
  )) as StrapiReleaseNotes | undefined;

  if (!strapiReleaseNotes) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release notes data');
  }

  return strapiReleaseNotes;
};
