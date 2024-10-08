import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BlocksContentCodec } from './BlocksContentCodec';
import { MediaCodec } from './MediaCodec';

export const BannerLinkCodec = t.strict({
  id: t.number,
  title: t.union([NullToUndefinedCodec, t.string]),
  subtitle: t.union([NullToUndefinedCodec, t.string]),
  content: t.union([NullToUndefinedCodec, BlocksContentCodec]),
  icon: t.strict({ data: MediaCodec }),
  theme: t.union([t.literal('light'), t.literal('dark')]),
});

export type BannerLink = t.TypeOf<typeof BannerLinkCodec>;
