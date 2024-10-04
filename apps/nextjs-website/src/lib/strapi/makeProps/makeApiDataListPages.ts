import { ApiDataListTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { StrapiApiDataListPages } from '../codecs/ApiDataListPagesCodec';
import { mergeProductWithStaticContent } from './makeProducts';

export function makeApiDataListPagesProps(
  apiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListTemplateProps> {
  return apiDataListPages.data.map(({ attributes }) => {
    const product = mergeProductWithStaticContent(
      attributes.product.data.attributes
    );
    return {
      ...attributes,
      hero: {
        title: attributes.title,
        subtitle: attributes.description || '',
      },
      product,
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
      bannerLinks: [
        ...attributes.bannerLinks.map((bannerLink) => ({
          content: bannerLink.content,
          icon: bannerLink.icon.data.attributes,
          theme: bannerLink.theme || 'dark',
          title: bannerLink.title || '',
        })),
      ],
      seo: attributes.seo,
    };
  });
}
