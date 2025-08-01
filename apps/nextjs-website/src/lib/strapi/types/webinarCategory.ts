import { StrapiMedia } from '@/lib/strapi/types/media';
import { Pagination } from '@/lib/strapi/types/pagination';

export type StrapiWebinarCategory = {
  readonly id: number;
  readonly attributes: {
    readonly name: string;
    readonly icon: { readonly data: StrapiMedia };
  };
};

export type StrapiWebinarCategories = {
  readonly data: readonly StrapiWebinarCategory[];
  readonly meta: {
    readonly pagination: Pagination;
  };
};
