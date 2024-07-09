import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { ApiDataPages } from './strapi/codecs/ApiDataCodec';

export function makeApisDataPageProps(
  apiDataPages: ApiDataPages
): ReadonlyArray<ApiPageProps> {
  return apiDataPages.data.map(({ attributes }) => ({
    ...attributes,
    apiDataSlug: attributes.slug,
    specURLs: [...attributes.specUrls.map((spec) => ({ ...spec }))],
    specURLsName: attributes.title,
    soapDocumentation: {
      title: attributes.soapDocumentation?.title || '',
      url: attributes.soapDocumentation?.url || '',
      buttonLabel: attributes.soapDocumentation?.buttonLabel || '',
      icon: attributes.soapDocumentation?.icon?.data?.attributes?.url || '',
    },
  }));
}
