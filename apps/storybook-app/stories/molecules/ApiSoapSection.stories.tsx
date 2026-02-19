import { Meta, StoryObj } from '@storybook/nextjs';
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
    apiName: 'API Name',
    apiSlug: 'api-slug',
    apiRepositoryUrl: 'https://github.com/pagopa/pagopa-api/tree/develop/wsdl',
    apiUrls: [
      '/soap-api/wsdl/nodeForPa.wsdl.xml',
      '/soap-api/wsdl/nodeForPsp.wsdl.xml',
      '/soap-api/wsdl/paForNode.wsdl.xml',
      '/soap-api/wsdl/pspForNode.wsdl.xml',
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
