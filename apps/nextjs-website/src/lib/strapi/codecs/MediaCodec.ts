import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const MediaAttributesCodec = t.strict({
  name: t.string,
  alternativeText: t.union([NullToUndefinedCodec, t.string]),
  caption: t.union([NullToUndefinedCodec, t.string]),
  width: t.union([NullToUndefinedCodec, t.number]),
  height: t.union([NullToUndefinedCodec, t.number]),
  ext: t.string,
  mime: t.string,
  url: t.string,
});

export const MediaCodec = t.strict({
  attributes: MediaAttributesCodec,
});

export type Media = t.TypeOf<typeof MediaAttributesCodec>;
