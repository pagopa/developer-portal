/* eslint-disable functional/no-expression-statements */
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/product/mapper';
import { compact } from 'lodash';
import { ApiDataList, ApiDataPageProps } from './types';
import { getSoapApiMetadata } from '@/helpers/s3Metadata.helpers';
import { staticContentsUrl } from '@/config';

export async function getApiSoapContentUrls(
  locale: string,
  apiDirName: string
) {
  const soapApiMetadata = await getSoapApiMetadata(locale).then((metadata) =>
    metadata.find((item) => item.dirName === apiDirName)
  );
  if (!soapApiMetadata) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(`No metadata found for API directory: ${apiDirName}`);
  }

  return soapApiMetadata.contentS3Paths.map(
    (url) => `${staticContentsUrl}/${locale}/soap-api/${url}`
  );
}

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
                  ? apiPage.bannerLinks.map(makeBannerLinkProps)
                  : apiPage.product.bannerLinks?.map(makeBannerLinkProps),
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
