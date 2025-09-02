import { StrapiMedia } from '@/lib/strapi/types/media';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type StrapiBannerLink = {
  readonly id: number;
  readonly title?: string | null;
  readonly content?: BlocksContent | null;
  readonly icon: { readonly data: StrapiMedia };
  readonly theme: 'light' | 'dark';
};
