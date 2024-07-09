import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { ApiDataListPages } from './strapi/ApiDataListPageCodec';

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
        title: apidata?.attributes?.title,
        text: apidata?.attributes?.description || '',
        icon: apidata?.attributes?.icon?.data?.attributes.url || '',
        href: `/${attributes.product.data?.attributes.slug}/api/${attributes.apiData.data[index].attributes.slug}`,
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
