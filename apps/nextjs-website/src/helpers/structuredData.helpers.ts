import { baseUrl, organizationInfo, websiteName } from '@/config';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import {
  BreadcrumbList,
  ImageObject,
  ListItem,
  Organization,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

export const organization: Organization = {
  '@type': 'Organization',
  ...organizationInfo,
};

export const organizationWithContext: WithContext<Organization> = {
  '@context': 'https://schema.org',
  ...organization,
};

export const website: WebSite = {
  '@type': 'WebSite',
  name: websiteName,
  url: baseUrl,
};

export const websiteWithContext: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  ...website,
};

export type StructuredDataBreadcrumbList = readonly Pick<
  ListItem,
  'name' | 'item'
>[];

export type StructuredDataMedia = Partial<
  Pick<Media, 'url' | 'width' | 'height'>
>;

export type StructuredDataWebPage = Omit<WebPage, '@type'> & {
  readonly media?: StructuredDataMedia;
};

export function makeBreadcrumbList(
  items: StructuredDataBreadcrumbList
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      ...item,
    })),
  };
}

function mediaToImageObject(media: StructuredDataMedia): ImageObject {
  return {
    '@type': 'ImageObject',
    url: media.url,
    width: `${media.width}`,
    height: `${media.height}`,
  };
}

export function makeWebPage(
  webPage: StructuredDataWebPage
): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...webPage,
    isPartOf: webPage.isPartOf || website,
    author: webPage.author || organization,
    image:
      webPage.image ||
      (webPage.media ? mediaToImageObject(webPage.media) : undefined),
  };
}
