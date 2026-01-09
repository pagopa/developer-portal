import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export type UrlReplaceMap = Record<string, string>;

export function makeUrlReplaceMap(
  strapiUrlReplacemap: RootEntity<StrapiUrlReplaceMap>
): UrlReplaceMap {
  return strapiUrlReplacemap.data.urlToGuide.reduce((map, obj) => {
    return {
      ...map,
      [obj.url]: `/${obj.guide?.product.slug}/guides/${obj.guide?.slug}${
        obj.subPath ? `/${obj.subPath}` : ''
      }`,
    };
  }, {} as UrlReplaceMap);
}
