import { StrapiBlocksContent } from '@/lib/strapi/codecs/BlocksContentCodec';
import { Media } from '@/lib/strapi/types/media';

export type StrapiBannerLink = {
  readonly id: number;
  readonly title?: string | null;
  readonly content?: StrapiBlocksContent | null;
  readonly icon: { readonly data: Media };
  readonly theme: 'light' | 'dark';
};
