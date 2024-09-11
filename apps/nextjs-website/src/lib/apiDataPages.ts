import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiData } from './strapi/codecs/ApiDataListCodec';

export function makeApiDataProps(
  apiData: StrapiApiData
): ReadonlyArray<ApiPageProps> {
  return apiData.data
    .filter((apiPage) => apiPage.attributes.apiRestDetail)
    .map(({ attributes }) => ({
      ...attributes,
      apiDataSlug: attributes.apiRestDetail?.slug || '',
      specURLs: attributes.apiRestDetail
        ? [...attributes.apiRestDetail.specUrls.map((spec) => ({ ...spec }))]
        : [],
      specURLsName: attributes.title,
    }));
}
