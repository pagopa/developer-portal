import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const MediaCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    alternativeText: t.union([NullToUndefinedCodec, t.string]),
    caption: t.union([NullToUndefinedCodec, t.string]),
    width: t.number,
    height: t.number,
    ext: t.string,
    mime: t.string,
    url: t.string,
  }),
});
