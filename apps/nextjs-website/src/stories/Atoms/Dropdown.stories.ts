import type { Meta, StoryObj } from '@storybook/react';

import Dropdown from '../../components/atoms/Dropdown/Dropdown';

const meta = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Dropdown',
    items: [
      { href: '#1', label: 'Item 1' },
      { href: '#2', label: 'Item 2' },
      { href: '#3', label: 'Item 3' },
    ],
  }
};
