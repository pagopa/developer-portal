import { Meta, StoryObj } from '@storybook/react';
import Stats from '../../../nextjs-website/src/components/atoms/Stats/Stats';

const meta: Meta<typeof Stats> = {
  title: 'Atoms/Stats',
  component: Stats,
};

export default meta;

export const Showcase: StoryObj<typeof Stats> = {
  args: {
    items: [
      {
        title: '+50%',
        subtitle: 'Some Subtitle',
        description: 'Some very long text description',
      },
      {
        title: '15%',
        subtitle: 'Some Subtitle',
        description: 'Some very long text description',
      },
      {
        title: '2 mesi',
        subtitle: 'Some Subtitle',
        description: 'Some very long text description',
      },
    ],
  },
};
