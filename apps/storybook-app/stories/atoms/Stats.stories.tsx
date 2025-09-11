import { Meta, StoryObj } from '@storybook/nextjs';
import Stats from '../../../nextjs-website/src/components/atoms/Stats/Stats';

const meta: Meta<typeof Stats> = {
  title: 'Atoms/Stats',
  component: Stats,
};

export default meta;

export const Showcase: StoryObj<typeof Stats> = {
  args: {
    maxWidth: 265,
    items: [
      {
        title: '+50%',
        description: 'Some very long text description',
      },
      {
        title: '15%',
        description: 'Some very long text description',
      },
      {
        title: '2 mesi',
        description: 'Some very long text description',
      },
    ],
    statsSource:
      'Dati forniti da [Nome della fonte], aggiornati a [mese/anno].',
  },
};
