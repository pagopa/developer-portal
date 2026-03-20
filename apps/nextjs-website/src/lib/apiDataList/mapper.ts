/* eslint-disable functional/no-expression-statements */
import { mapBannerLinkProps } from '@/lib/shared/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/product/mapper';
import { compact } from 'lodash';
import { ApiDataList, ApiDataPageProps } from './types';
import { getApiSoapContentUrls } from './helpers';

export async function mapApiDataList(
  locale: string,
  strapiApiDataList: ApiDataList
): Promise<ReadonlyArray<ApiDataPageProps>> {
  const list = compact(
    await Promise.all(
      strapiApiDataList.data
        .filter((apiPage) => apiPage.apiRestDetail || apiPage.apiSoapDetail)
        .map(async (apiPage) => {
          if (!apiPage.apiRestDetail && !apiPage.apiSoapDetail) {
            console.error(
              `Error while processing API Data with title "${apiPage.title}": missing API details. Skipping...`
            );
            return null;
          }
          const apiDataSlug =
            apiPage.apiRestDetail?.slug || apiPage.apiSoapDetail?.slug || '';
          if (!apiDataSlug) {
            console.error(
              `Error while processing API Data with title "${apiPage.title}": missing API slug. Skipping...`
            );
            return null;
          }

          if (!apiPage.product) {
            console.error(
              `Error while processing API Data with title "${apiPage.title}": missing product data. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            const product = makeBaseProductWithoutLogoProps(
              locale,
              apiPage.product
            );
            return {
              ...apiPage,
              product,
              apiType: apiPage.apiRestDetail ? 'rest' : 'soap',
              apiDataSlug: apiDataSlug,
              restApiSpecUrls: apiPage.apiRestDetail
                ? [
                    ...apiPage.apiRestDetail.specUrls.map((spec) => ({
                      ...spec,
                    })),
                  ]
                : [],
              apiSoapUrl: apiPage.apiSoapDetail?.repositoryUrl,
              specUrlsName: apiPage.title,
              apiSoapUrlList: apiPage.apiSoapDetail
                ? await getApiSoapContentUrls(
                    locale,
                    apiPage.apiSoapDetail.dirName
                  )
                : [],
              bannerLinks:
                apiPage.bannerLinks.length > 0
                  ? apiPage.bannerLinks.map(mapBannerLinkProps)
                  : apiPage.product.bannerLinks?.map(mapBannerLinkProps),
              seo: apiPage.seo,
            } satisfies ApiDataPageProps;
          } catch (error) {
            console.error(
              `Error while processing API Data with title "${apiPage.title}":`,
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
