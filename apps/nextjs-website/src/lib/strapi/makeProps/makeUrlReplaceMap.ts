import { UrlReplaceMap } from '../codecs/UrlReplaceMapCodec';

export type UrlReplacesMap = Record<string, string>;

export function makeUrlReplaceMap(
  urlReplacemap: UrlReplaceMap
): UrlReplacesMap {
  const map = urlReplacemap.data.attributes.urlToGuide.reduce((map, obj) => {
    return {
      ...map,
      [obj.url]: `${
        obj.guide.data?.attributes.product.data.attributes.slug
      }/guides/${obj.guide.data?.attributes.slug}${
        obj.version ? `/${obj.version}` : ''
      }`,
    };
  }, {} as UrlReplacesMap);
  return map;
}
