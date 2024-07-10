import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { ApiDataPages } from './strapi/codecs/ApiDataCodec';

export function makeApisDataPageProps(
  apiDataPages: ApiDataPages
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
