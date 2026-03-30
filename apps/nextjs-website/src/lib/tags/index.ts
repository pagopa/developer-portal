import { buildEnv } from '@/lib/buildEnv';
import { Tag } from '@/lib/tags/types';
import { fetchTags } from './fetcher';
import { mapTagsProps } from './mapper';

export const TagsRepository = {
  /**
   * Returns all tags
   * @param locale The locale used to get the tags.
   * @returns An array of tags with all their fields.
   */
  getAll: async (locale: string): Promise<readonly Tag[]> => {
    const strapiTags = await fetchTags(locale, buildEnv);
    return mapTagsProps(strapiTags);
  },
};
