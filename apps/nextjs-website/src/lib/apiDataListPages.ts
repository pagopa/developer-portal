import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { StrapiApiDataListPages } from './strapi/ApiDataListPageCodec';

export function makeApiDataListPageProps(
  apiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return apiDataListPages.data.map(({ attributes }) => ({
    ...attributes,
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
    product: attributes.product.data?.attributes || { name: '', slug: '' },
    cards: attributes.apiData.data.map((item) => ({
      target: (item.attributes.apiSoapUrl ? '_blank' : '_self') as
        | '_blank'
        | '_self',
      tags: [
        {
          label: item.attributes.apiSoapUrl ? 'SOAP' : 'REST',
        },
      ],
      title: item?.attributes?.title,
      text: item?.attributes?.description || '',
      icon: item?.attributes?.icon?.data?.attributes.url || '',
      externalUrl: !!item.attributes.apiSoapUrl,
      href:
        item.attributes.apiSoapUrl ||
        `/${attributes.product.data?.attributes.slug}/api/${item.attributes.apiRestDetail?.slug}`,
    })),
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
