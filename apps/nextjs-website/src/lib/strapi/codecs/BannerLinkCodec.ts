import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BlocksContentCodec } from './BlocksContentCodec';
import { MediaCodec } from './MediaCodec';

export const BannerLinkCodec = t.strict({
  id: t.number,
  title: t.union([NullToUndefinedCodec, t.string]),
  body: t.union([NullToUndefinedCodec, BlocksContentCodec]),
  icon: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
});
