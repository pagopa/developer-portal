import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from '@/lib/strapi/makeProps/makeProducts';
import { makeApiSoapUrlList } from '@/lib/strapi/makeProps/makeApiSoapUrlList';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import _ from 'lodash';

export async function makeApiDataList(
  strapiApiDataList: StrapiApiDataList
): Promise<ReadonlyArray<ApiDataPageProps>> {
  const list = _.compact(
    await Promise.all(
      strapiApiDataList.data
        .filter(
          (apiPage) =>
            apiPage.attributes.apiRestDetail || apiPage.attributes.apiSoapDetail
        )
        .map(async ({ attributes }) => {
          // eslint-disable-next-line functional/no-try-statements
          try {
            const product = makeBaseProductWithoutLogo(attributes.product.data);
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
            } satisfies ApiDataPageProps;
          } catch (error) {
            // eslint-disable-next-line functional/no-expression-statements
            console.error(
              `Error processing API Data with title "${attributes.title}":`,
              error
            );
            return null;
          }
        })
    )
  );
  return Promise.all(list);
}
