import { Media } from '@/lib/strapi/codecs/MediaCodec';

export type WebinarCategory = {
  readonly name: string;
  readonly icon: { readonly data: { readonly attributes: Media } };
};
