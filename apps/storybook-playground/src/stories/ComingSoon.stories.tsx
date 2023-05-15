import { Meta, StoryObj } from '@storybook/react';
import ComingSoon from 'ui/components/ComingSoon';

const meta: Meta<typeof ComingSoon> = {
  title: 'Components/Coming Soon',
  component: ComingSoon,
  tags: ['autodocs'],
};

export default meta;

export const Showcase: StoryObj<typeof ComingSoon> = {
  args: {
    title: 'Coming Soon',
    items: [
      {
        title: 'Lorem Ipsum',
        description:
          'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
      },
      {
        title: 'Lorem Ipsum',
        description:
          'There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...',
      },
      {
        title: 'Lorem Ipsum',
        description:
          'There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...',
      },
    ],
  },
};
