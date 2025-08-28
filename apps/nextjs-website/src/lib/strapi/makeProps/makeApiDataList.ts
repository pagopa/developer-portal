import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { makeApiSoapUrlList } from '@/lib/strapi/makeProps/makeApiSoapUrlList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';

export async function makeApiDataListProps(
  strapiApiDataList: StrapiApiDataList
): Promise<ReadonlyArray<ApiDataPageProps>> {
  const list = strapiApiDataList.data
    .filter(
      (apiPage) =>
        apiPage.attributes.apiRestDetail || apiPage.attributes.apiSoapDetail
    )
    .map(async ({ attributes }) => {
      const product = makeBaseProductWithoutLogoProps(attributes.product.data);
      return {
        ...attributes,
        product,
        apiType: attributes.apiRestDetail
          ? 'rest'
          : attributes.apiSoapDetail
          ? 'soap'
          : undefined,
        apiDataSlug:
          attributes.apiRestDetail?.slug ||
          attributes.apiSoapDetail?.slug ||
          '',
        restApiSpecUrls: attributes.apiRestDetail
          ? [...attributes.apiRestDetail.specUrls.map((spec) => ({ ...spec }))]
          : [],
        apiSoapUrl: attributes.apiSoapDetail?.repositoryUrl,
        specUrlsName: attributes.title,
        apiSoapUrlList: attributes.apiSoapDetail
          ? await makeApiSoapUrlList(attributes.apiSoapDetail.dirName)
          : [],
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
