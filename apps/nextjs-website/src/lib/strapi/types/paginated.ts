import { StrapiPagination } from '@/lib/strapi/types/pagination';

export type Paginated<T> = {
  readonly data: readonly T[];
  readonly meta: {
    readonly pagination: StrapiPagination;
  };
};
