import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { ApiDataListPages } from './strapi/ApiDataListPageCodec';
import { tags } from '@markdoc/markdoc';

export function makeApiDataListPageProps(
  apiDataListPages: ApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return apiDataListPages.data.map(({ attributes }) => ({
    ...attributes,
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
    product: attributes.product.data?.attributes || { name: '', slug: '' },
    cards: [
      ...attributes.apiData.data.map((apidata, index) => ({
        tags: [
          {
            label: attributes.apiData.data[index].attributes.apiSoapUrl
              ? 'SOAP'
              : 'REST',
          },
        ],
        title: apidata?.attributes?.title,
        text: apidata?.attributes?.description || '',
        icon: apidata?.attributes?.icon?.data?.attributes.url || '',
        externalUrl: !!attributes.apiData.data[index].attributes.apiSoapUrl,
        href:
          attributes.apiData.data[index].attributes.apiSoapUrl ||
          `/${attributes.product.data?.attributes.slug}/api/${attributes.apiData.data[index].attributes.apiRestDetail?.slug}`,
      })),
    ],
    bannerLinks: [
      ...attributes.bannerLinks.map((bannerLink) => ({
        content: bannerLink.content,
        icon: bannerLink.icon.data.attributes,
        theme: bannerLink.theme || 'dark',
        title: bannerLink.title || '',
      })),
    ],
  }));
}
