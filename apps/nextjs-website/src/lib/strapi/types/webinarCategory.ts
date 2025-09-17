import { StrapiMedia } from '@/lib/strapi/types/media';
import { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiWebinarCategory = {
  readonly id: number;
  readonly attributes: {
    readonly name: string;
    readonly icon: { readonly data: StrapiMedia };
  };
};

export type StrapiWebinarCategories = Paginated<StrapiWebinarCategory>;
