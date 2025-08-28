import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';

export function makeApiDataListPagesProps(
  strapiApiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return strapiApiDataListPages.data.map(({ attributes }) => {
    return {
      ...attributes,
      hero: {
        title: attributes.title,
        subtitle: attributes.description || '',
      },
      product: makeBaseProductWithoutLogoProps(attributes.product.data),
      apiDetailSlugs: attributes.apiData.data
        .map(({ attributes }) =>
          attributes.apiRestDetail
            ? attributes.apiRestDetail.slug
            : attributes.apiSoapDetail?.slug
        )
        .filter(Boolean) as readonly string[],
      cards: attributes.apiData.data
        .map((item) => ({
          tags: [
            {
              label: item.attributes.apiSoapDetail
                ? 'SOAP'
                : item.attributes.apiRestDetail
                ? 'REST'
                : '',
            },
          ].filter((tag) => !!tag.label),
          title: item?.attributes?.title,
          text: item?.attributes?.description || '',
          icon: item?.attributes?.icon?.data?.attributes.url || '',
          href: `/${attributes.product.data?.attributes.slug}/api/${
            item.attributes.apiRestDetail
              ? item.attributes.apiRestDetail?.slug
              : item.attributes.apiSoapDetail?.slug
          }`,
        }))
        .filter((card) => card.title && !!card.tags),
      bannerLinks: attributes.bannerLinks.map(makeBannerLinkProps),
      seo: attributes.seo,
      updatedAt: attributes.updatedAt,
    };
  });
}
