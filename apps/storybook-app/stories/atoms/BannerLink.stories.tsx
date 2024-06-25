import { Meta, StoryObj } from '@storybook/react';
import { BannerLink } from '../../../nextjs-website/src/components/atoms/BannerLink/BannerLink';
import { mockText, mockTextBlock } from '../mock-content.helper';

const meta: Meta<typeof BannerLink> = {
  title: 'Atoms/BannerLink',
  component: BannerLink,
};

export default meta;

export const Showcase: StoryObj<typeof BannerLink> = {
  args: {
    theme: 'light',
    icon: {
      name: 'feedback.svg',
      alternativeText: null,
      caption: null,
      width: 60,
      height: 61,
      ext: '.svg',
      mime: 'image/svg+xml',
      url: '/icons/feedback.svg',
    },
    title: mockText(2),
    count: 1,
    content: [
      {
        ...mockTextBlock({
          type: 'paragraph',
          wordCount: 2,
          url: '#',
        }),
      },
      { ...mockTextBlock({ type: 'paragraph', wordCount: 30 }) },
    ],
  },
};
