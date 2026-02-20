import { Meta, StoryObj } from '@storybook/nextjs';
import RelatedResources from 'nextjs-website/src/components/molecules/RelatedResources/RelatedResources';

const meta: Meta<typeof RelatedResources> = {
  title: 'Molecules/RelatedResources',
  component: RelatedResources,
};

export default meta;

export const Showcase: StoryObj<typeof RelatedResources> = {
  args: {
    resources: [
      {
        description: {
          title: 'Multe per violazioni al Codice della Strada',
          listItems: ['Item1', 'Item2'],
        },
        imagePath: '/icons/placeholder2000x1000.png',
        link: {
          href: '#',
          label: 'Vai alla guida',
        },
        mobileImagePath: '/icons/placeholder1000x1000.png',
        title: 'Guida pratica',
      },
    ],
    downloadableDocuments: [
      {
        title: 'Documento 1',
        downloadLink: '#',
        size: 100,
        tags: [{ label: 'PDF' }],
      },
    ],
  },
};
