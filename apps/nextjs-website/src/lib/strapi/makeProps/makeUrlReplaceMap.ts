import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';

export type UrlReplaceMap = Record<string, string>;

export function makeUrlReplaceMap(
  strapiUrlReplacemap: StrapiUrlReplaceMap
): UrlReplaceMap {
  return strapiUrlReplacemap.urlToGuide.reduce((map, obj) => {
    return {
      ...map,
      [obj.url]: `/${obj.guide?.product.slug}/guides/${obj.guide?.slug}${
        obj.subPath ? `/${obj.subPath}` : ''
      }`,
    };
  }, {} as UrlReplaceMap);
}
