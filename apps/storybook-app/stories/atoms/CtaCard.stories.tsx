import { Meta, StoryObj } from '@storybook/react';
import CtaCard from '../../../nextjs-website/src/components/atoms/CtaCard/CtaCard';

const meta: Meta<typeof CtaCard> = {
  title: 'Atoms/CtaCard',
  component: CtaCard,
};

export default meta;

export const Showcase: StoryObj<typeof CtaCard> = {
  args: {
    title: 'Title',
    text: 'Text',
    cta: {
      label: 'Label',
      href: 'https://example.com',
    },
  },
};

