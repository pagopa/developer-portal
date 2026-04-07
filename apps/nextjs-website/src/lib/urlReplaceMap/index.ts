import { buildEnv } from '@/lib/buildEnv';
import { fetchUrlReplaceMap } from './fetcher';
import { mapUrlReplaceMap } from './mapper';
import { UrlReplaceMap } from './types';

export const UrlReplaceMapRepository = {
  get: async (locale: string): Promise<UrlReplaceMap> => {
    const strapiUrlReplaceMap = await fetchUrlReplaceMap(locale, buildEnv);
    return mapUrlReplaceMap(locale, strapiUrlReplaceMap);
  },
};
