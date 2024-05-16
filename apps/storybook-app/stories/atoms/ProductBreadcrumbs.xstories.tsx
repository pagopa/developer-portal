import { Meta, StoryObj } from '@storybook/react';
import ProductBreadcrumbs from '../../../nextjs-website/src/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';

const meta: Meta<typeof ProductBreadcrumbs> = {
  title: 'Atoms/ProductBreadcrumbs',
  component: ProductBreadcrumbs,
};

export default meta;

export const Showcase: StoryObj<typeof ProductBreadcrumbs> = {
  args: {
    breadcrumbs: [
      {
        name: 'Home',
        path: '/',
      },
      {
        name: 'Category',
        path: '/category',
      },
      {
        name: 'Subcategory',
        path: '/subcategory',
      },
      {
        name: 'Product',
        path: '/product',
      },
    ],
  },
};
