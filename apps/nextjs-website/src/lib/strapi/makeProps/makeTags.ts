import { StrapiTag, StrapiTags } from '@/lib/strapi/types/tag';
import { Tag } from '@/lib/types/tag';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export function makeTagsProps(
  strapiTags: RootEntity<StrapiTags>
): ReadonlyArray<Tag> {
  return strapiTags.data.map(makeTagProps);
}

export function makeTagProps(tag: StrapiTag): Tag {
  return {
    name: tag.name,
    icon: tag.icon,
  };
}
