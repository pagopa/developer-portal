import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';

export type UrlReplaceMap = Record<string, string>;

export function makeUrlReplaceMap(
  strapiUrlReplacemap: StrapiUrlReplaceMap
): UrlReplaceMap {
  return strapiUrlReplacemap.data.urlToGuide.reduce((map, obj) => {
    return {
      ...map,
      [obj.url]: `/${obj.guide.data?.product.data.slug}/guides/${
        obj.guide.data?.slug
      }${obj.subPath ? `/${obj.subPath}` : ''}`,
    };
  }, {} as UrlReplaceMap);
}
