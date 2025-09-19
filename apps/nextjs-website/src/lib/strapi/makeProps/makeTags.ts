import { StrapiTag, StrapiTags } from '@/lib/strapi/types/tag';
import { Tag } from '@/lib/types/tag';

export function makeTagsProps(strapiTags: StrapiTags): ReadonlyArray<Tag> {
  return strapiTags.data.map(makeTagProps);
}

export function makeTagProps(tag: StrapiTag): Tag {
  return {
    name: tag.attributes.name,
    icon: tag.attributes.icon,
  };
}
