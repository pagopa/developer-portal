import {
  fetchResponseFromCDN,
} from '@/helpers/s3Metadata.helpers';
import { getSyncedSolutionsResponseJsonFile } from 'gitbook-docs/syncedResponses';
import { StrapiSolutions } from './types';

export const fetchSolutions = async (
  locale: string
): Promise<StrapiSolutions | undefined> =>
  (await fetchResponseFromCDN(
    `${locale}/${getSyncedSolutionsResponseJsonFile}`
  )) as StrapiSolutions | undefined;
