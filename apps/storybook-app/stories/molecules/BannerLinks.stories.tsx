import { Meta, StoryObj } from '@storybook/react';
import { BannerLinks } from 'nextjs-website/src/components/molecules/BannerLinks/BannerLinks';
import { mockTextBlock } from '../mock-content.helper';

const meta: Meta<typeof BannerLinks> = {
  title: 'Molecules/BannerLinks',
  component: BannerLinks,
};

export default meta;

export const Showcase: StoryObj<typeof BannerLinks> = {
  args: {
    bannerLinks: [
      {
        theme: 'light',
        icon: {
          name: 'headset.svg',
          alternativeText: null,
          caption: null,
          width: 60,
          height: 61,
          ext: '.svg',
          mime: 'image/svg+xml',
          url: '/icons/headset.svg',
        },
        title: 'Titolo',
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 30 }) }],
      },
      {
        theme: 'dark',
        icon: {
          name: 'headset.svg',
          alternativeText: null,
          caption: null,
          width: 60,
          height: 61,
          ext: '.svg',
          mime: 'image/svg+xml',
          url: '/icons/headset.svg',
        },
        title: 'Titolo',
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 28 }) }],
      },
    ],
  },
};
