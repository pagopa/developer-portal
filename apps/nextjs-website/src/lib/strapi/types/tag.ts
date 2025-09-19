import { StrapiMedia } from '@/lib/strapi/types/media';
import { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiTag = {
  readonly attributes: {
    readonly name: string;
    readonly icon: { readonly data: StrapiMedia };
  };
};

export type StrapiTags = Paginated<StrapiTag>;
