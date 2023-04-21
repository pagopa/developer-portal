import { Meta, StoryObj } from '@storybook/react';
import ListItemButton from '@/components/ListItemButton';

const meta: Meta<typeof ListItemButton> = {
  title: 'Components/List Item Button',
  component: ListItemButton,
  tags: ['autodocs'],
};
export default meta;

export const SelectedItemWithoutChildren: StoryObj<typeof ListItemButton> = {
  args: {
    kind: 'single',
    text: 'Lorem ipsum',
    isCurrent: true,
    href: '/lorem-ipsum',
  },
};

export const NotSelectedItem: StoryObj<typeof ListItemButton> = {
  args: {
    text: 'Lorem ipsum',
    isCurrent: false,
    kind: 'single',
    href: '/lorem-ipsum',
  },
};

export const ItemWithChildrenCollapseOpen: StoryObj<typeof ListItemButton> = {
  args: {
    text: 'Lorem ipsum',
    isCurrent: false,
    kind: 'withChildren',
    href: '/lorem-ipsum',
    onClick: () => {},
    collapseOpen: true,
  },
};

export const ItemWithChildrenCollapseClosed: StoryObj<typeof ListItemButton> = {
  args: {
    text: 'Lorem ipsum',
    isCurrent: false,
    kind: 'withChildren',
    href: '/lorem-ipsum',
    onClick: () => {},
    collapseOpen: false,
  },
  parameters: {

  }
};
