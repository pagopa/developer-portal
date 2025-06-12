import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiDataList } from '../codecs/ApiDataListCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { makeApiSoapUrlList } from '@/lib/strapi/makeProps/makeApiSoapUrlList';

export function makeApiDataListProps(
  strapiApiDataList: StrapiApiDataList
): Promise<ReadonlyArray<ApiDataPageProps>> {
  const list = strapiApiDataList.data
    .filter((apiPage) => apiPage.attributes.apiRestDetail)
    .map(async ({ attributes }) => {
      const product = makeBaseProductWithoutLogoProps(attributes.product.data);
      return {
        ...attributes,
        product,
        apiType: attributes.apiRestDetail ? 'rest' : 'soap',
        apiDataSlug:
          attributes.apiRestDetail?.slug || attributes.apiSoapDetail?.slug,
        specUrls: attributes.apiRestDetail
          ? [...attributes.apiRestDetail.specUrls.map((spec) => ({ ...spec }))]
          : [],
        apiSoapUrl: attributes.apiSoapDetail?.repositoryUrl,
        specUrlsName: attributes.title,
        apiSoapWsdlUrlList: await makeApiSoapUrlList(
          attributes.apiSoapDetail.dirName
        ),
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map(makeBannerLinkProps)
            : attributes.product.data.attributes.bannerLinks?.map(
                makeBannerLinkProps
              ),
        seo: attributes.seo,
      } satisfies ApiDataPageProps;
    });
  return Promise.all(list);
}
