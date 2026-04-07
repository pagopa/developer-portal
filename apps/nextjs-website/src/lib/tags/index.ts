import { buildEnv } from '@/lib/buildEnv';
import { Tag } from '@/lib/types/tag';
import { fetchTags } from './fetcher';
import { mapTagsProps } from './mapper';

export const TagsRepository = {
  getAll: async (locale: string): Promise<readonly Tag[]> => {
    const strapiTags = await fetchTags(locale, buildEnv);
    return mapTagsProps(strapiTags);
  },
};
