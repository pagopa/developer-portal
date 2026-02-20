import { Meta, StoryObj } from '@storybook/nextjs';
import UseCaseTemplate from 'nextjs-website/src/components/templates/UseCaseTemplate/UseCaseTemplate';
import { mockImageBlock, mockTextBlock } from '../mock-content.helper';
import { productsFixture } from '../fixtures/productsFixture';

const meta: Meta<typeof UseCaseTemplate> = {
  title: 'Templates/UseCaseTemplate',
  component: UseCaseTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof UseCaseTemplate> = {
  args: {
    title: 'Use Case',
    path: 'use-case',
    bannerLinks: [],
    relatedLinks: {
      title: 'Link correlati',
      links: [
        {
          text: 'Link 1',
          href: 'https://developer.pagopa.it',
        },
        {
          text: 'Link 2',
          href: 'https://developer.pagopa.it',
        },
      ],
    },
    parts: [
      {
        component: 'blockRenderer',
        html: [
          {
            ...mockTextBlock({
              type: 'heading',
              level: 2,
              text: 'Sottotitolo',
            }),
          },
          { ...mockTextBlock() },
          { ...mockTextBlock() },
          { ...mockImageBlock() },
          {
            ...mockTextBlock({
              type: 'heading',
              level: 2,
              text: 'Sottotitolo',
            }),
          },
          { ...mockTextBlock() },
        ],
      },
      {
        component: 'blockRenderer',
        html: [
          {
            ...mockTextBlock({
              type: 'heading',
              level: 2,
              text: 'Sottotitolo',
            }),
          },
          { ...mockTextBlock() },
          { ...mockTextBlock() },
          { ...mockTextBlock() },
        ],
      },
    ],
    product: productsFixture[1],
  },
};
