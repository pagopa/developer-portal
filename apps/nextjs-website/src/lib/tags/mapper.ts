import type { Tag } from '@/lib/tags/types';
import type { StrapiTag, StrapiTags } from './strapiTypes';

export function mapTagsProps(strapiTags: StrapiTags): ReadonlyArray<Tag> {
  return strapiTags.data.map(mapTagProps);
}

export function mapTagProps(tag: StrapiTag): Tag {
  return {
    name: tag.name,
    icon: tag.icon,
  };
}
