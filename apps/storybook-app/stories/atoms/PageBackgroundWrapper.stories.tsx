import { Meta, StoryObj } from '@storybook/react';
import PageBackgroundWrapper from '../../../nextjs-website/src/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';

const meta: Meta<typeof PageBackgroundWrapper> = {
  title: 'Atoms/PageBackgroundWrapper',
  component: PageBackgroundWrapper,
};

export default meta;

export const Showcase: StoryObj<typeof PageBackgroundWrapper> = {
  args: {
    children: 'This is the children',
  },
};
