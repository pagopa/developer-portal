import { MediaAttributes } from '@/lib/strapi/types/media';

export type WebinarCategory = {
  readonly name: string;
  readonly icon: { readonly data: { readonly attributes: MediaAttributes } };
};
