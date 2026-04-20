import { buildEnv } from '@/lib/buildEnv';
import type { CustomMessages } from './types';
import { fetchCustomMessagesMap } from './fetcher';
import { mapCustomMessagesMap } from './mapper';

export const CustomMessagesMapRepository = {
  get: async (locale: string): Promise<CustomMessages> => {
    const strapiCustomMessagesMap = await fetchCustomMessagesMap(
      locale,
      buildEnv
    );
    return mapCustomMessagesMap(strapiCustomMessagesMap);
  },
};
