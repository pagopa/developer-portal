import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { StrapiApiDataListPages } from '../codecs/ApiDataListPagesCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { soapApiPageActive } from '@/config';

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
          target: soapApiPageActive
            ? '_self'
            : ((item.attributes.apiSoapUrl ? '_blank' : '_self') as
                | '_blank'
                | '_self'),
          tags: [
            {
              label: soapApiPageActive
                ? item.attributes.apiSoapUrl
                  ? 'SOAP'
                  : item.attributes.apiSoapUrl
                  ? 'REST'
                  : ''
                : item.attributes.apiSoapUrl
                ? 'SOAP'
                : 'REST',
            },
          ].filter((tag) => !!tag.label),
          title: item?.attributes?.title,
          text: item?.attributes?.description || '',
          icon: item?.attributes?.icon?.data?.attributes.url || '',
          externalUrl: !!item.attributes.apiSoapUrl,
          href: soapApiPageActive
            ? `/${attributes.product.data?.attributes.slug}/api/${
                item.attributes.apiRestDetail
                  ? item.attributes.apiRestDetail?.slug
                  : item.attributes.apiSoapDetail?.slug
              }`
            : item.attributes.apiSoapUrl ||
              `/${attributes.product.data?.attributes.slug}/api/${item.attributes.apiRestDetail?.slug}`,
        }))
        .filter((card) => card.title && !!card.tags),
      bannerLinks: attributes.bannerLinks.map(makeBannerLinkProps),
      seo: attributes.seo,
    };
  });
}
