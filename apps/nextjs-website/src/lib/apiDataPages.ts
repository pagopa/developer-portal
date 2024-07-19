import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiData } from './strapi/codecs/ApiDataCodec';

export function makeApiDataProps(
  apiDataPages: StrapiApiData
): ReadonlyArray<ApiPageProps> {
  return apiDataPages.data
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
