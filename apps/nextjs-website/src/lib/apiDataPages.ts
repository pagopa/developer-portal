import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { ApiDataPages } from './strapi/codecs/ApiDataCodec';

export function makeApisDataPageProps(
  apiDataPages: ApiDataPages
): ReadonlyArray<ApiPageProps> {
  return apiDataPages.data.map(({ attributes }) => ({
    ...attributes,
    apiDataSlug: attributes.slug,
    specURLs: [
      ...attributes.specUrls.map((spec) => ({
        url: spec.url,
        name: 'bubbo',
      })),
    ],
    specURLsName: attributes.title,
  }));
}
