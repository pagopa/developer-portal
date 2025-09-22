/* eslint-disable functional/no-expression-statements */
import { ApiDataPageData as ApiDataPageData } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { makeBannerLink } from '@/lib/strapi/makeData/makeBannerLink';
import { makeBaseProductWithoutLogo } from '@/lib/strapi/makeData/makeProducts';
import { makeApiSoapUrlList } from '@/lib/strapi/makeData/makeApiSoapUrlList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import { compact } from 'lodash';

export async function makeApiDataList(
  strapiApiDataList: StrapiApiDataList
): Promise<ReadonlyArray<ApiDataPageData>> {
  const list = compact(
    await Promise.all(
      strapiApiDataList.data
        .filter(
          (apiPage) =>
            apiPage.attributes.apiRestDetail || apiPage.attributes.apiSoapDetail
        )
        .map(async ({ attributes }) => {
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

          if (!attributes.product.data) {
            console.error(
              `Error while processing API Data with title "${attributes.title}": missing product data. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            const product = makeBaseProductWithoutLogo(attributes.product.data);
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
                  ? attributes.bannerLinks.map(makeBannerLink)
                  : attributes.product.data.attributes.bannerLinks?.map(
                      makeBannerLink
                    ),
              seo: attributes.seo,
            } satisfies ApiDataPageData;
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
