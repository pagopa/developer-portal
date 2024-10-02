import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiDataList } from '../codecs/ApiDataListCodec';
import { mergeProductWithStaticContent } from '@/lib/strapi/makeProps/makeProducts';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeApiDataListProps(
  apiDataList: StrapiApiDataList
): ReadonlyArray<ApiDataPageProps> {
  return apiDataList.data
    .filter((apiPage) => apiPage.attributes.apiRestDetail)
    .map(({ attributes }) => {
      const product = mergeProductWithStaticContent(
        attributes.product.data.attributes
      );

      return {
        ...attributes,
        apiDataSlug: attributes.apiRestDetail?.slug || '',
        specURLs: attributes.apiRestDetail
          ? [...attributes.apiRestDetail.specUrls.map((spec) => ({ ...spec }))]
          : [],
        specURLsName: attributes.title,
        product,
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
