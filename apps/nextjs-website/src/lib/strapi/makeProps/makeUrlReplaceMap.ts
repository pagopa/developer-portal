import { StrapiUrlReplaceMap } from "@/lib/strapi/types/urlReplaceMap";

export type UrlReplaceMap = Record<string, string>;

export function makeUrlReplaceMap(
  strapiUrlReplacemap: StrapiUrlReplaceMap,
): UrlReplaceMap {
  return strapiUrlReplacemap.data.attributes.urlToGuide.reduce((map, obj) => {
    return {
      ...map,
      [obj.url]: `/${
        obj.guide.data?.attributes.product.data.attributes.slug
      }/guides/${obj.guide.data?.attributes.slug}${
        obj.subPath ? `/${obj.subPath}` : ""
      }`,
    };
  }, {} as UrlReplaceMap);
}
