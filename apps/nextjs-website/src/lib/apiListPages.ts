import { ApiListPageTemplateProps } from '@/components/templates/ApiListPageTemplate/ApiListPageTemplate';
import { ApiListPages } from './strapi/ApiListPageCodec';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';

export function makeApiListPageProps(
  apiListPages: ApiListPages
): ReadonlyArray<ApiListPageTemplateProps> {
  return apiListPages.data.map(({ attributes }) => ({
    ...attributes,
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
    bannerLinks: {
      bannerLinks: [
        ...attributes.bannerLinks.map((bannerLink) => ({
          content: bannerLink.content,
          icon: bannerLink.icon,
          theme: bannerLink.theme,
          title: bannerLink.title,
        })),
      ],
    },
    cards: [
      ...attributes.api_data.map((api) => ({
        title: api.title,
        text: api.description || '',
        href: api.specUrls[0].url,
        icon: api.icon,
        tags: [{ label: api.tag }],
      })),
    ],
    breadcrumbs: {
      path: '',
      product: attributes.product?.attributes || pagoPa,
      paths: [],
    },
  }));
}
