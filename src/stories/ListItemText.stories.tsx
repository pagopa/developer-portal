import { Meta, StoryObj } from '@storybook/react';
import ListItemText from '@/components/ListItemText';

const meta: Meta<typeof ListItemText> = {
  title: 'Components/List Item Text',
  component: ListItemText,
  tags: ['autodocs'],
};

export default meta;

export const SelectedItem: StoryObj<typeof ListItemText> = {
  args: {
    text: 'Lorem ipsum',
    isCurrent: true,
    href: '/lorem-ipsum',
  },
};

export const NotSelectedItem: StoryObj<typeof ListItemText> = {
  args: {
    text: 'Lorem ipsum',
    isCurrent: false,
    href: '/lorem-ipsum',
  },
};
