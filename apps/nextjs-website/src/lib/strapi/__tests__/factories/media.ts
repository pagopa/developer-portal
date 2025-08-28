import { StrapiMedia, Media } from '@/lib/strapi/types/media';

const mediaAttributes = {
  name: 'example.png',
  alternativeText: 'Example Image',
  caption: undefined,
  width: 800,
  height: 600,
  size: 123456,
  ext: '.png',
  mime: 'image/png',
  url: 'https://example.com/example.png',
} satisfies Media;

export function mediaJpeg() {
  return {
    attributes: {
      ...mediaAttributes,
      name: 'example.jpg',
      ext: '.jpg',
      mime: 'image/jpeg',
      url: 'https://example.com/example.jpg',
    },
  } satisfies StrapiMedia;
}
