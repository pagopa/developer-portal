import * as t from 'io-ts/lib';
import { BlocksContentCodec } from './BlocksContentCodec';
import { MediaCodec } from './MediaCodec';

export const BannerLinkCodec = t.strict({
  title: t.string,
  body: BlocksContentCodec,
  icon: t.strict({
    data: MediaCodec,
  }),
});
