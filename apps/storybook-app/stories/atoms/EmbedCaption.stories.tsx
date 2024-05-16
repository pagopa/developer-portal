import { Meta, StoryObj } from '@storybook/react';
import EmbedCaption from '../../../nextjs-website/src/components/atoms/EmbedCaption/EmbedCaption';

const meta: Meta<typeof EmbedCaption> = {
  title: 'Atoms/EmbedCaption',
  component: EmbedCaption,
};

export default meta;

export const Showcase: StoryObj<typeof EmbedCaption> = {
  args: {
    children: 'This is the children',
  },
};
