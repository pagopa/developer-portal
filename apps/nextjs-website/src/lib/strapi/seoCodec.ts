import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { MediaAttributesCodec } from './codecs/MediaCodec';

export const SEOImageFormatCodec = t.partial({
  name: t.union([NullToUndefinedCodec, t.string]),
  hash: t.union([NullToUndefinedCodec, t.string]),
  ext: t.union([NullToUndefinedCodec, t.string]),
  mime: t.union([NullToUndefinedCodec, t.string]),
  width: t.union([NullToUndefinedCodec, t.number]),
  height: t.union([NullToUndefinedCodec, t.number]),
  size: t.union([NullToUndefinedCodec, t.number]),
  path: t.union([NullToUndefinedCodec, t.string]),
  url: t.union([NullToUndefinedCodec, t.string]),
});

export const SEOMetaSocialCodec = t.partial({
  id: t.union([NullToUndefinedCodec, t.number]),
  socialNetwork: t.union([NullToUndefinedCodec, t.string]),
  title: t.union([NullToUndefinedCodec, t.string]),
  description: t.union([NullToUndefinedCodec, t.string]),
  card: t.union([NullToUndefinedCodec, t.string]),
  site: t.union([NullToUndefinedCodec, t.string]),
  creator: t.union([NullToUndefinedCodec, t.string]),
});

export const SEOCodec = t.partial({
  id: t.union([NullToUndefinedCodec, t.number]),
  metaTitle: t.union([NullToUndefinedCodec, t.string]),
  metaDescription: t.union([NullToUndefinedCodec, t.string]),
  keywords: t.union([NullToUndefinedCodec, t.string]),
  metaRobots: t.union([NullToUndefinedCodec, t.string]),
  metaViewport: t.union([NullToUndefinedCodec, t.string]),
  canonicalURL: t.union([NullToUndefinedCodec, t.string]),
  metaImage: t.partial({
    data: t.union([
      NullToUndefinedCodec,
      t.partial({ attributes: MediaAttributesCodec }),
    ]),
  }),
  metaSocial: t.array(SEOMetaSocialCodec),
  structuredData: t.union([NullToUndefinedCodec, t.unknown]),
});
