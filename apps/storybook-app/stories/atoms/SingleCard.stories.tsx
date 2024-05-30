import { Meta, StoryObj } from '@storybook/react';
import SingleCard from '../../../nextjs-website/src/components/atoms/SingleCard/SingleCard';

const meta: Meta<typeof SingleCard> = {
  title: 'Atoms/SingleCard',
  component: SingleCard,
};

export default meta;

export const Showcase: StoryObj<typeof SingleCard> = {
  args: {
    title: 'This is the title',
    children: 'This is the children',
  },
};
