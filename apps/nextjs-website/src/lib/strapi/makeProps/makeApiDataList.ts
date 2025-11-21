/* eslint-disable functional/no-expression-statements */
import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { makeApiSoapUrlList } from '@/lib/strapi/makeProps/makeApiSoapUrlList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import { compact } from 'lodash';

export async function makeApiDataListProps(
  strapiApiDataList: StrapiApiDataList
): Promise<ReadonlyArray<ApiDataPageProps>> {
  const list = compact(
    await Promise.all(
      strapiApiDataList
        .filter((apiPage) => apiPage.apiRestDetail || apiPage.apiSoapDetail)
        .map(async (attributes) => {
          if (!attributes.apiRestDetail && !attributes.apiSoapDetail) {
            console.error(
              `Error while processing API Data with title "${attributes.title}": missing API details. Skipping...`
            );
            return null;
          }
          const apiDataSlug =
            attributes.apiRestDetail?.slug ||
            attributes.apiSoapDetail?.slug ||
            '';
          if (!apiDataSlug) {
            console.error(
              `Error while processing API Data with title "${attributes.title}": missing API slug. Skipping...`
            );
            return null;
          }

          if (!attributes.product) {
            console.error(
              `Error while processing API Data with title "${attributes.title}": missing product data. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            const product = makeBaseProductWithoutLogoProps(attributes.product);
            return {
              ...attributes,
              product,
              apiType: attributes.apiRestDetail ? 'rest' : 'soap',
              apiDataSlug: apiDataSlug,
              restApiSpecUrls: attributes.apiRestDetail
                ? [
                    ...attributes.apiRestDetail.specUrls.map((spec) => ({
                      ...spec,
                    })),
                  ]
                : [],
              apiSoapUrl: attributes.apiSoapDetail?.repositoryUrl,
              specUrlsName: attributes.title,
              apiSoapUrlList: attributes.apiSoapDetail
                ? await makeApiSoapUrlList(attributes.apiSoapDetail.dirName)
                : [],
              bannerLinks:
                attributes.bannerLinks.length > 0
                  ? attributes.bannerLinks.map(makeBannerLinkProps)
                  : attributes.product.bannerLinks?.map(makeBannerLinkProps),
              seo: attributes.seo,
            } satisfies ApiDataPageProps;
          } catch (error) {
            console.error(
              `Error while processing API Data with title "${attributes.title}":`,
              error,
              'Skipping...'
            );
            return null;
          }
        })
    )
  );
  return Promise.all(list);
}
