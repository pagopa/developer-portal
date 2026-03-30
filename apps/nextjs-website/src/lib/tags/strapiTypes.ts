import { StrapiMedia } from '@/lib/media/strapiTypes';
import { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiTag = {
  readonly name: string;
  readonly icon: StrapiMedia;
};

export type StrapiTags = Paginated<StrapiTag>;
