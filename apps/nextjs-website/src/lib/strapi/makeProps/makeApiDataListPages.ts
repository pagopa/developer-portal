import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { StrapiApiDataListPages } from '../codecs/ApiDataListPagesCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';

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
      apiRestDetailSlugs: attributes.apiData.data
        .map(({ attributes }) => attributes.apiRestDetail?.slug)
        .filter(Boolean) as readonly string[],
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
      bannerLinks: attributes.bannerLinks.map(makeBannerLinkProps),
      seo: attributes.seo,
    };
  });
}
