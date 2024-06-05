import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';

export const ProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    description: t.union([t.null, t.string]),
    slug: t.string,
    logo: t.strict({ data: MediaCodec }),
  }),
});
