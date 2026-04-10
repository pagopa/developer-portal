import { buildEnv } from '@/lib/buildEnv';
import { fetchUrlReplaceMap } from './fetcher';
import { mapUrlReplaceMap } from './mapper';
import { UrlReplaceMap } from './types';

export const UrlReplaceMapRepository = {
  /**
   * Returns the URL Replace Map for a given locale
   * @param locale The locale used to get the URL Replace Map.
   * @returns The URL Replace Map for the given locale.
   */
  get: async (locale: string): Promise<UrlReplaceMap> => {
    const strapiUrlReplaceMap = await fetchUrlReplaceMap(locale, buildEnv);
    return mapUrlReplaceMap(locale, strapiUrlReplaceMap);
  },
};
