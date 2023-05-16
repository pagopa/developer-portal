import { Meta, StoryObj } from '@storybook/react';
import GuideCollection from 'ui/components/GuideCollection';

const meta: Meta<typeof GuideCollection> = {
  title: 'Components/Guides',
  component: GuideCollection,
  tags: ['autodocs'],
};

export default meta;

export const GuideCollectionPreview: StoryObj<typeof GuideCollection> = {
  args: {
    type: 'guide-collection',
    category: {
      id: "per-l'integrazione",
      title: "Per l'integrazione",
    },
    guides: [
      {
        type: 'guide-preview',
        title: 'Integrazione',
        preview: {
          title: 'Argomenti trattati',
          description: [
            'Setup iniziale: come aderire',
            'Creare e pubblicare un servizio',
            'Inviare un messaggio',
            'Eseguire test sulle funzionalità',
          ],
          link: '/io/guide/integrazione',
          image: {
            src: 'https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            alt: 'Immagine di IO',
          },
        },
      },
    ],
  },
};
