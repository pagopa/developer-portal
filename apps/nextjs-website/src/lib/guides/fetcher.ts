import { fetchResponseFromCDN } from '@/helpers/s3Metadata.helpers';
import { getSyncedGuidesResponseJsonFile } from 'gitbook-docs/syncedResponses';
import type { StrapiGuides } from './strapiTypes';

export const fetchGuides = async (
  locale: string
): Promise<StrapiGuides | undefined> => {
  const response = await fetchResponseFromCDN(
    `${locale}/${getSyncedGuidesResponseJsonFile}`
  );
  return response as StrapiGuides | undefined;
};
