import { UrlReplaceMap } from '../codecs/UrlReplaceMapCodec';

export type UrlReplacesMap = { readonly [url: string]: string };

export function makeUrlReplaceMap(
  urlReplacemap: UrlReplaceMap
): UrlReplacesMap {
  const map = urlReplacemap.data.attributes.urlToGuide.reduce(
    (map, obj) =>
      map.set(
        obj.url,
        [
          `${obj.guide.data?.attributes.product.data.attributes.slug}/guides/${obj.guide.data?.attributes.slug}`,
          obj.version ? obj.version : null,
        ].join('/')
      ),
    new Map<string, string>()
  );
  return Object.freeze(Object.fromEntries(map));
}
