import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiDataList } from '../codecs/ApiDataListCodec';

export function makeApiDataListProps(
  apiDataList: StrapiApiDataList
): ReadonlyArray<ApiPageProps> {
  return apiDataList.data
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
