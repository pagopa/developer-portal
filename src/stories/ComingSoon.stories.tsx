import { Meta, StoryObj } from '@storybook/react';
import ComingSoon from '@/components/ComingSoon';

const meta: Meta<typeof ComingSoon> = {
  /* The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Coming Soon',
  component: ComingSoon,
  /*
   * This will generate a documentation page.
   */
  tags: ['autodocs'],
};

export default meta;

export const Showcase: StoryObj<typeof ComingSoon> = {
  args: {
    // The args you need here will depend on your component
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
