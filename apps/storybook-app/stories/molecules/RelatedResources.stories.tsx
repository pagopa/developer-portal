import { Meta, StoryObj } from '@storybook/react';
import RelatedResources from 'nextjs-website/src/components/molecules/RelatedResources/RelatedResources';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof RelatedResources> = {
  title: 'Molecules/RelatedResources',
  component: RelatedResources,
};

export default meta;

export const Showcase: StoryObj<typeof RelatedResources> = {
  decorators: [nextIntlContextDecorator],
  args: {
    guide: {
      description: {
        title: 'Multe per violazioni al Codice della Strada',
        listItems: ['Item1', 'Item2'],
      },
      imagePath: 'https://via.placeholder.com/2000x1000',
      link: {
        href: '#',
        label: 'Vai alla guida',
      },
      mobileImagePath: 'https://via.placeholder.com/150',
      title: 'Guida pratica',
    },
  },
};
