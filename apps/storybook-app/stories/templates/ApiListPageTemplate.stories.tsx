import { Meta, StoryObj } from '@storybook/react';
import ApiDataListPageTemplate from '../../../nextjs-website/src/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { mockText, mockTextBlock } from '../mock-content.helper';

const meta: Meta<typeof ApiListPageTemplate> = {
  title: 'Templates/ApiListPageTemplate',
  component: ApiListPageTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof ApiListPageTemplate> = {
  decorators: [nextIntlContextDecorator],
  args: {
    breadcrumbs: {
      product: {
        name: 'Piattaforma pagoPA',
        description: 'Il portale per gli sviluppatori di PagoPA',
        slug: 'pagopa',
        logo: {
          url: 'https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg',
        },
        subpaths: {
          overview: {
            name: 'api',
            path: 'api',
          },
        },
      },
      path: 'PagoPA',
      paths: [
        {
          name: 'API',
          path: 'API',
        },
      ],
    },
    hero: {
      title: 'API',
      subtitle:
        'Se vuoi sapere come iscriverti a un e-service partendo dal catalogo e ottenere un voucher per la fruizione del sevizio.',
    },
    cards: [
      {
        title: mockText(3),
        text: mockText(10),
        icon: '/icons/code.svg',
        ctaLabel: 'Esplora le API',
        href: '#',
        tags: [
          {
            label: 'REST',
          },
        ],
      },
      {
        title: mockText(3),
        text: mockText(10),
        icon: '/icons/code.svg',
        ctaLabel: 'Esplora le API',
        href: '#',
        tags: [
          {
            label: 'SOAP',
          },
        ],
      },
      {
        title: mockText(3),
        text: mockText(10),
        icon: '/icons/code.svg',
        ctaLabel: 'Esplora le API',
        href: '#',
        tags: [
          {
            label: 'REST',
          },
        ],
      },
      {
        title: mockText(3),
        text: mockText(10),
        icon: '/icons/code.svg',
        ctaLabel: 'Esplora le API',
        href: '#',
        tags: [
          {
            label: 'REST',
          },
        ],
      },
    ],
    bannerLinks: [
      {
        theme: 'light',
        icon: {
          name: 'headset.svg',
          alternativeText: null,
          caption: null,
          width: 60,
          height: 61,
          ext: '.svg',
          mime: 'image/svg+xml',
          url: '/icons/headset.svg',
        },
        title: mockText(2),
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 30 }) }],
      },
      {
        theme: 'dark',
        icon: {
          name: 'headset.svg',
          alternativeText: null,
          caption: null,
          width: 60,
          height: 61,
          ext: '.svg',
          mime: 'image/svg+xml',
          url: '/icons/headset.svg',
        },
        title: mockText(2),
        content: [{ ...mockTextBlock({ type: 'paragraph', wordCount: 28 }) }],
      },
    ],
  },
};
