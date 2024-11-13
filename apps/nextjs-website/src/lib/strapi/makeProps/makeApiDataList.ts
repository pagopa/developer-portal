import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiDataList } from '../codecs/ApiDataListCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithRelationsCodec } from './makeProducts';

export function makeApiDataListProps(
  strapiApiDataList: StrapiApiDataList
): ReadonlyArray<ApiDataPageProps> {
  return strapiApiDataList.data
    .filter((apiPage) => apiPage.attributes.apiRestDetail)
    .map(({ attributes }) => {
      const product = makeBaseProductWithRelationsCodec(
        attributes.product.data
      );
      return {
        ...attributes,
        product,
        apiDataSlug: attributes.apiRestDetail?.slug || '',
        specURLs: attributes.apiRestDetail
          ? [...attributes.apiRestDetail.specUrls.map((spec) => ({ ...spec }))]
          : [],
        specURLsName: attributes.title,
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map(makeBannerLinkProps)
            : attributes.product.data.attributes.bannerLinks?.map(
                makeBannerLinkProps
              ),
        seo: attributes.seo,
      };
    });
}
