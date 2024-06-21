import { Meta, StoryObj } from '@storybook/react';
import Spinner from '../../../nextjs-website/src/components/atoms/Spinner/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
};

export default meta;

export const Showcase: StoryObj<typeof Spinner> = {
  args: {},
};
