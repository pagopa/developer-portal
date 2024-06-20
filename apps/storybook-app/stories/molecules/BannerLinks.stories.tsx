import { Meta, StoryObj } from '@storybook/react';
import { BannerLinks } from '../../../nextjs-website/src/components/molecules/BannerLinks/BannerLinks';
import { mockTextBlock } from '../mock-content.helper';

const meta: Meta<typeof BannerLinks> = {
  title: 'Molecules/BannerLinks',
  component: BannerLinks,
};

export default meta;

export const Showcase: StoryObj<typeof BannerLinks> = {
  args: {
    banners: [
      {
        theme: 'light',
        icon: 'Feedback',
        title: 'Titolo',
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 30 }) }],
      },
      {
        theme: 'dark',
        icon: 'Feedback',
        title: 'Titolo',
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 28 }) }],
      },
      {
        theme: 'light',
        icon: 'Feedback',
        title: 'Titolo',
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 32 }) }],
      },
    ],
  },
};
