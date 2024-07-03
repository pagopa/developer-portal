import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { ApiDataListPages } from './strapi/ApiDataListPageCodec';

export function makeApiDataListPageProps(
  apiListPages: ApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return apiListPages.data.map(({ attributes }) => ({
    ...attributes,
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
    breadcrumbs: {
      product: {
        name: '',
        description: attributes.product.attributes.description ?? '',
        slug: attributes.product?.attributes.slug ?? '',
        logo: attributes.product?.attributes.logo.data.attributes,
        subpaths: {
          overview: {
            name: '',
            path: '',
          },
        },
        path: '',
      },
      path: '',
      paths: [],
    },
    cards: [],
    bannerLinks: [],
  }));
}
