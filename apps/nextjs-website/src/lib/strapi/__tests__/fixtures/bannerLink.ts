import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { BannerLinkData } from '@/components/atoms/BannerLink/BannerLink';
import { mediaJpeg } from '../factories/media';

export const strapiBannerLink: StrapiBannerLink = {
  id: 1,
  title: 'Developer Portal',
  content: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'Access the developer documentation',
        },
      ],
    },
  ],
  theme: 'light',
  icon: {
    data: mediaJpeg(),
  },
};

export const expectedBannerLinkProps: BannerLinkData = {
  title: 'Developer Portal',
  content: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'Access the developer documentation',
        },
      ],
    },
  ],
  theme: 'light',
  icon: {
    name: 'example.jpg',
    alternativeText: 'Example Image',
    caption: undefined,
    width: 800,
    height: 600,
    ext: '.jpg',
    mime: 'image/jpeg',
    size: 123456,
    url: 'https://example.com/example.jpg',
  },
};
