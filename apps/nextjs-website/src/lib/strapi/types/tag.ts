import { StrapiMedia } from '@/lib/strapi/types/media';
import { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiTag = {
  readonly name: string;
  readonly icon: StrapiMedia;
};

export type StrapiTags = Paginated<StrapiTag>;
