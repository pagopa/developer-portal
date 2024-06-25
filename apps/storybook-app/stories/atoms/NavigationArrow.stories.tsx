import { Meta, StoryObj } from '@storybook/react';
import NavigationArrow from '../../../nextjs-website/src/components/atoms/NavigationArrow/NavigationArrow';

const meta: Meta<typeof NavigationArrow> = {
  title: 'Atoms/NavigationArrow',
  component: NavigationArrow,
};

export default meta;

export const RightShowcase: StoryObj<typeof NavigationArrow> = {
  args: {
    direction: 'right',
    hidden: false,
  },
};

export const LeftShowcase: StoryObj<typeof NavigationArrow> = {
  args: {
    direction: 'left',
    hidden: false,
  },
};
