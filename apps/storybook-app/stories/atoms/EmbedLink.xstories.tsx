import { Meta, StoryObj } from '@storybook/react';
import EmbedLink from '../../../nextjs-website/src/components/atoms/EmbedLink/EmbedLink';

const meta: Meta<typeof EmbedLink> = {
  title: 'Atoms/EmbedLink',
  component: EmbedLink,
};

export default meta;

export const Showcase: StoryObj<typeof EmbedLink> = {
  args: {
    url: 'https://www.example.com',
  },
};
