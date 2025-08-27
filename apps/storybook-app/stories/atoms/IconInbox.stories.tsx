import { Meta, StoryObj } from '@storybook/nextjs';
import IconInbox from '../../../nextjs-website/src/components/atoms/IconInbox/IconInbox';

const meta: Meta<typeof IconInbox> = {
  title: 'Atoms/IconInbox',
  component: IconInbox,
};

export default meta;

export const Showcase: StoryObj<typeof IconInbox> = {
  args: {},
};
