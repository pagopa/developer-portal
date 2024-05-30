import { Meta, StoryObj } from '@storybook/react';
import Dropdown from '../../../nextjs-website/src/components/atoms/Dropdown/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
};

export default meta;

export const Showcase: StoryObj<typeof Dropdown> = {
  args: {
    label: 'This is the label',
    items: [
      {
        label: 'Option 1',
        href: '#',
      },
      {
        label: 'Option 2',
        href: '#',
      },
    ],
  },
};
