import { StrapiMedia } from '@/lib/strapi/types/media';

export function mediaJpeg() {
  return {
    alternativeText: 'Example Image',
    caption: undefined,
    width: 800,
    height: 600,
    size: 123456,
    name: 'example.jpg',
    ext: '.jpg',
    mime: 'image/jpeg',
    url: 'https://example.com/example.jpg',
  } satisfies StrapiMedia;
}
