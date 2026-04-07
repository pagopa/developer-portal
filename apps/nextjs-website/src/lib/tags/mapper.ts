import { Tag } from '@/lib/types/tag';
import { StrapiTag, StrapiTags } from './types';

export function mapTagsProps(strapiTags: StrapiTags): ReadonlyArray<Tag> {
  return strapiTags.data.map(mapTagProps);
}

export function mapTagProps(tag: StrapiTag): Tag {
  return {
    name: tag.name,
    icon: tag.icon,
  };
}
