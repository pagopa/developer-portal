import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { StrapiApiDataList } from '../codecs/ApiDataListCodec';
import { mergeProductWithStaticContent } from './makeProducts';

export function makeApiDataListProps(
  apiDataList: StrapiApiDataList
): ReadonlyArray<ApiPageProps> {
  return apiDataList.data
    .filter((apiPage) => apiPage.attributes.apiRestDetail)
    .map(({ attributes }) => {
      const product = mergeProductWithStaticContent(
        attributes.product.data.attributes
      );
      return {
        ...attributes,
        product,
        apiDataSlug: attributes.apiRestDetail?.slug || '',
        specURLs: attributes.apiRestDetail
          ? [...attributes.apiRestDetail.specUrls.map((spec) => ({ ...spec }))]
          : [],
        specURLsName: attributes.title,
        seo: attributes.seo,
      };
    });
}
