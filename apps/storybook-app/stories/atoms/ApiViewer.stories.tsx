import { Meta, StoryObj } from '@storybook/react';
import ApiViewer from '../../../nextjs-website/src/components/atoms/ApiViewer/ApiViewer';

const meta: Meta<typeof ApiViewer> = {
  title: 'Atoms/ApiViewer',
  component: ApiViewer,
};

export default meta;

export const Showcase: StoryObj<typeof ApiViewer> = {
  args: {
    product: {
      name: 'IO, l’app dei servizi pubblici',
      description:
        'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini.',
      slug: 'app-io',
      path: '/app-io',
      logo: {
        name: '',
        width: 60,
        height: 61,
        ext: '.svg',
        mime: 'image/svg+xml',
        url: '/icons/appIo.svg',
      },
      subpaths: {
        overview: {
          name: 'Overview',
          path: '/app-io/overview',
        },
        quickStart: {
          name: 'Quick Start',
          path: '/app-io/quick-start',
        },
        tutorials: {
          name: 'Tutorials',
          path: '/app-io/tutorials',
        },
        guides: {
          name: 'Guides',
          path: '/app-io/guides',
        },
        api: {
          name: 'API',
          path: '/app-io/api',
        },
      },
    },
    specURL:
      'https://raw.githubusercontent.com/pagopa/io-functions-services/master/openapi/index.yaml',
  },
};
