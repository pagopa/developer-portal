import { RootEntity } from '@/lib/strapi/types/rootEntity';
import { StrapiUrlReplaceMap, UrlReplaceMap } from './types';

export function mapUrlReplaceMap(
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
