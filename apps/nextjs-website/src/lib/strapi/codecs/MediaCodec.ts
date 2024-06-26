import * as t from 'io-ts/lib';

export const MediaAttributesCodec = t.strict({
  name: t.string,
  alternativeText: t.union([t.null, t.string]),
  caption: t.union([t.null, t.string]),
  width: t.number,
  height: t.number,
  ext: t.string,
  mime: t.string,
  url: t.string,
});

export const MediaCodec = t.strict({
  attributes: MediaAttributesCodec,
});

export type Media = t.TypeOf<typeof MediaAttributesCodec>;
