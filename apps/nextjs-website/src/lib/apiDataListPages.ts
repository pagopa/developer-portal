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
    cards: [],
    bannerLinks: [],
  }));
}
