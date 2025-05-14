import { Media } from '@/lib/strapi/codecs/MediaCodec';

export type WebinarCategory = {
  readonly name: string;
  readonly icon: { readonly data: { readonly attributes: Media } };
};

export const allWebinarCategory: WebinarCategory = {
  name: 'Tutti',
  icon: {
    data: {
      attributes: {
        name: 'all.svg',
        alternativeText: '',
        caption: '',
        width: 32,
        height: 32,
        size: 32,
        ext: '.svg',
        mime: 'image/svg',
        url: ' icons/all.svg',
      },
    },
  },
};
