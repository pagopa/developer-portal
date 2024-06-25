import { Meta, StoryObj } from '@storybook/react';
import RelatedLinks from '../../../nextjs-website/src/components/atoms/RelatedLinks/RelatedLinks';

const meta: Meta<typeof RelatedLinks> = {
  title: 'Atoms/RelatedLinks',
  component: RelatedLinks,
};

export default meta;

export const Showcase: StoryObj<typeof RelatedLinks> = {
  args: {
    title: 'This is the title',
    links: [
      {
        text: 'This is the title',
        href: 'https://example.com',
      },
    ],
  },
};
