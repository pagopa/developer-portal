import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { StrapiApiDataListPages } from '../codecs/ApiDataListPagesCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeApiDataListPagesProps(
  apiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return apiDataListPages.data.map(({ attributes }) => ({
    ...attributes,
    hero: {
      title: attributes.title,
      subtitle: attributes.description || '',
    },
    product: attributes.product.data?.attributes || {
      name: '',
      slug: '',
      shortName: '',
    },
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
  }));
}
