import { RootEntity } from '@/lib/strapi/types/rootEntity';
import { StrapiUrlReplaceMap, UrlReplaceMap } from './types';

export function mapUrlReplaceMap(
  locale: string,
  strapiUrlReplacemap: RootEntity<StrapiUrlReplaceMap>
): UrlReplaceMap {
  return strapiUrlReplacemap.data.urlToGuide.reduce((map, obj) => {
    const productSlug = obj.guide?.product?.slug;
    const guideSlug = obj.guide?.slug;
    if (!productSlug || !guideSlug) {
      return map;
    }
    return {
      ...map,
      [obj.url]: `/${locale}/${productSlug}/guides/${guideSlug}${
        obj.subPath ? `/${obj.subPath}` : ''
      }`,
    };
  }, {} as UrlReplaceMap);
}
