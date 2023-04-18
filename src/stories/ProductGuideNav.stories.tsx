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
    product: {
      name: "L'App IO",
      slug: 'app-io',
    },
    guideSlug: 'io-guida-tecnica',
    versionSlug: 'v2.3',
    slug: 'setup-iniziale',
    title: 'Setup iniziale',
    body: 'Questa è la guida tecnica',
    navLinks: [
      {
        name: 'Home',
        path: '/',
      },
    ],
    productGuideNavLinks: [
      {
        title: 'Setup',
        path: '/app-io/io-guida-tecnica/v2.3/setup-iniziale',
        kind: 'page',
        pages: [],
        slug: 'setup-iniziale',
        description: 'Questa è la guida tecnica',
      },
    ],
  },
};
