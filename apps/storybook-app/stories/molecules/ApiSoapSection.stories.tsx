import { Meta, StoryObj } from '@storybook/react';
import ApiSoapSection from 'nextjs-website/src/components/molecules/ApiSoapSection/ApiSoapSection';
import { Product } from 'nextjs-website/src/lib/types/product';

const meta: Meta<typeof ApiSoapSection> = {
  title: 'Molecules/ApiSoapSection',
  component: ApiSoapSection,
};

export default meta;

export const Showcase: StoryObj<typeof ApiSoapSection> = {
  args: {
    product: {
      name: 'Product Name',
      shortName: 'Product Short Name',
      bannerLinks: [],
      slug: 'product-slug',
      description: 'This is a product description for the API.',
      logo: {
        url: 'https://example.com/logo.png',
        alt: 'Product Logo',
      },
    } satisfies Product,
    apisName: 'API Name',
    apisSlug: 'api-slug',
    apiUrls: [
      {
        name: 'nodeForPa',
        url: '/wsdl/wsdl/nodeForPa.wsdl.xml',
      },
      {
        name: 'nodeForPsp',
        url: '/wsdl/wsdl/nodeForPsp.wsdl.xml',
      },
      {
        name: 'paForNodeVeryLongNameOverflowing',
        url: '/wsdl/wsdl/paForNode.wsdl.xml',
      },
      {
        name: 'pspForNode',
        url: '/wsdl/wsdl/pspForNode.wsdl.xml',
      },
    ],
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/api/product-slug/api-slug',
      },
    },
  },
};
