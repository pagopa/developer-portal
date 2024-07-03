import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { ApiListPages } from './strapi/ApiDataListPageCodec';

export function makeApiDataListPageProps(
  apiListPages: ApiListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return apiListPages.data.map(({ attributes }) => ({
    ...attributes,
    product: attributes.product?.attributes.slug || '',
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
  }));
}
