import { Meta, StoryObj } from '@storybook/react';
import ApiDataListTemplate from 'nextjs-website/src/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { nextIntlContextDecorator } from '../next-intl-context.helper';
import { mockText, mockTextBlock } from '../mock-content.helper';

const meta: Meta<typeof ApiDataListTemplate> = {
  title: 'Templates/ApiDataListTemplate',
  component: ApiDataListTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof ApiDataListTemplate> = {
  decorators: [nextIntlContextDecorator],
  args: {
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
        externalUrl: false,
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
        externalUrl: true,
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
        externalUrl: false,
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
        externalUrl: false,
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
