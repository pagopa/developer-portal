import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiDataList } from '../codecs/ApiDataListCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeApiDataListProps(
  apiDataList: StrapiApiDataList
): ReadonlyArray<ApiDataPageProps> {
  return apiDataList.data
    .filter((apiPage) => apiPage.attributes.apiRestDetail)
    .map(({ attributes }) => {
      const product = {
        ...attributes.product.data.attributes,
        description: '',
        bannerLinks:
          attributes.product.data.attributes.bannerLinks?.map(
            makeBannerLinkProps
          ) || [],
      };
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
