import { ApiListPageTemplateProps } from '@/components/templates/ApiListPageTemplate/ApiListPageTemplate';
import { ApiListPages } from './strapi/ApiListPageCodec';

export function makeApiListPageProps(
  apiListPages: ApiListPages
): ReadonlyArray<ApiListPageTemplateProps> {
  return apiListPages.data.map(({ attributes }) => ({
    ...attributes,
    product: attributes.product?.attributes.slug || '',
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
  }));
}
