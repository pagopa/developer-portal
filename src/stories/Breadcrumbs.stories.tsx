import { Meta, StoryObj } from '@storybook/react';
import Breadcrumbs from '@/components/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  /* The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  /*
   * This will generate a documentation page.
   */
  tags: ['autodocs'],
};

export default meta;

export const Breadcrumb: StoryObj<typeof Breadcrumbs> = {
  args: {
    // The args you need here will depend on your component
    items: [
      {
        name: 'Home',
        path: '/',
        isCurrent: false,
      },
      {
        name: 'Tutorial',
        path: '/tutorial',
        isCurrent: true,
      },
    ],
  },
};
