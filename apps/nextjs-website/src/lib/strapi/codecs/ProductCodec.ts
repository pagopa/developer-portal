import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const ProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    shortName: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    slug: t.string,
    logo: t.strict({ data: MediaCodec }),
  }),
});

export const BaseProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    shortName: t.string,
    slug: t.string,
  }),
});
