import { Meta, StoryObj } from '@storybook/react';
import ProductGuideMenu from 'ui/components/ProductGuideMenu';

const meta: Meta<typeof ProductGuideMenu> = {
  title: 'Components/Navigation/Product Guide Navigator',
  component: ProductGuideMenu,
  tags: ['autodocs'],
};

export default meta;

export const GuideNav: StoryObj<typeof ProductGuideMenu> = {
  args: {
    title: 'Setup iniziale',
    versionsMenu: [
      { name: '0', path: '/guide-root/v0' },
      { name: '1', path: '/guide-root/v1' },
    ],
    guidePath: '/guide-root',
    currentPath: '/guide-root/page-1',
    nav: [
      {
        kind: 'page',
        path: '/guide-root/page-1',
        name: { nav: 'page-1', breadcrumb: 'page-1' },
      },
      {
        kind: 'page',
        path: '/guide-root/page-1/page-1-1',
        name: { nav: 'page-1-1', breadcrumb: 'page-1-1' },
      },
      {
        kind: 'page',
        path: '/guide-root/page-1/page-1-1/page-1-1-1',
        name: { nav: 'page-1-1-1', breadcrumb: 'page-1-1-1' },
      },

      {
        kind: 'group',
        path: '/guide-root/group-1',
        name: { nav: 'group-1', breadcrumb: 'group-1' },
      },
      {
        kind: 'link',
        path: '/guide-root/link-1',
        name: { nav: 'link-1', breadcrumb: 'link-1' },
        href: 'anHref',
      },
    ],
  },
};
