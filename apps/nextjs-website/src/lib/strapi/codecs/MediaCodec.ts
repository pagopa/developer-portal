import * as t from 'io-ts/lib';

export const MediaCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    alternativeText: t.union([t.null, t.string]),
    caption: t.union([t.null, t.string]),
    width: t.number,
    height: t.number,
    ext: t.string,
    mime: t.string,
    url: t.string,
  }),
});
