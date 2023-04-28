import { Meta, StoryObj } from '@storybook/react';
import ProductGuideNav from '@/components/ProductGuideNav';

const meta: Meta<typeof ProductGuideNav> = {
  title: 'Components/Navigation/Product Guide Navigator',
  component: ProductGuideNav,
  tags: ['autodocs'],
};

export default meta;

export const GuideNav: StoryObj<typeof ProductGuideNav> = {
  args: {
    title: 'Setup iniziale',
    versions: '0',
    selected: '/v0/page0/page1',
    expanded: ['/v0/page0'],
    items: [
      {
        kind: 'page',
        name: 'Page - 0',
        path: '/v0/page0',
        children: [
          {
            kind: 'page',
            name: 'Page - 1',
            path: '/v0/page0/page1',
            children: [
              {
                kind: 'page',
                name: 'Page - 2',
                path: '/v0/page0/page1/page2',
                children: [],
              },
            ],
          },
        ],
      },
      {
        kind: 'page',
        name: 'Page - 0 1',
        path: '/v0/page01',
        children: [
          {
            kind: 'page',
            name: 'Page - 1 1',
            path: '/v0/page01/page11',
            children: [
              {
                kind: 'page',
                name: 'Page - 2 1',
                path: '/v0/page01/page11/page21',
                children: [],
              },
            ],
          },
        ],
      },
      {
        kind: 'group',
        name: 'Group - 0',
        path: '/v0/group0',
      },
      {
        kind: 'link',
        name: 'Link',
        href: 'https://pagopa.it',
      },
    ],
  },
};
