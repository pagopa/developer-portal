import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';

const UrlCodec = t.strict({
  id: t.number,
  url: t.string,
});

export const ApiDataCodec = t.strict({
  id: t.number,
  title: t.string,
  description: t.string,
  icon: MediaCodec,
  slug: t.string,
  specUrls: t.array(UrlCodec),
  tag: t.string,
});
