import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

const UrlCodec = t.strict({
  id: t.number,
  url: t.string,
});

export const ApiDataCodec = t.strict({
  id: t.number,
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
  icon: t.union([NullToUndefinedCodec, MediaCodec]),
  slug: t.string,
  specUrls: t.array(UrlCodec),
  tag: t.union([NullToUndefinedCodec, t.string]),
});
