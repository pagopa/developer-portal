import { Meta, StoryObj } from '@storybook/nextjs';
import LinkButton from '../../../nextjs-website/src/components/atoms/LinkButton/LinkButton';

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
};

export default meta;

export const Showcase: StoryObj<typeof LinkButton> = {
  args: {},
};
