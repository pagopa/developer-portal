import { Meta, StoryObj } from '@storybook/react';
import BodyWrapper from '../../../nextjs-website/src/components/atoms/BodyWrapper/BodyWrapper';

const meta: Meta<typeof BodyWrapper> = {
  title: 'Atoms/BodyWrapper',
  component: BodyWrapper,
};

export default meta;

export const Showcase: StoryObj<typeof BodyWrapper> = {
  args: {
    children: 'This is the children',
  },
};
