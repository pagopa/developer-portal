import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export type UrlReplaceMap = Record<string, string>;

export function makeUrlReplaceMap(
  locale: string,
  strapiUrlReplacemap: RootEntity<StrapiUrlReplaceMap>
): UrlReplaceMap {
  return strapiUrlReplacemap.data.urlToGuide.reduce((map, obj) => {
    return {
      ...map,
      [obj.url]: `/${locale}/${obj.guide?.product.slug}/guides/${
        obj.guide?.slug
      }${obj.subPath ? `/${obj.subPath}` : ''}`,
    };
  }, {} as UrlReplaceMap);
}
