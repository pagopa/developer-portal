import { StrapiMedia } from '@/lib/strapi/types/media';

export type WebinarCategory = {
  readonly name: string;
  readonly icon: { readonly data: StrapiMedia };
};
