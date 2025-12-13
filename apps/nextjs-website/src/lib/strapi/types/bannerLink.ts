import { StrapiMedia } from '@/lib/strapi/types/media';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type StrapiBannerLink = {
  readonly id: number;
  readonly title?: string;
  readonly content?: BlocksContent;
  readonly icon: StrapiMedia;
  readonly theme: 'light' | 'dark';
};
