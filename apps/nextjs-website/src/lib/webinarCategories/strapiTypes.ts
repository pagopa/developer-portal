import type { StrapiMedia } from '@/lib/media/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiWebinarCategory = {
  readonly id: number;
  readonly name: string;
  readonly icon: StrapiMedia;
};

export type StrapiWebinarCategories = Paginated<StrapiWebinarCategory>;
