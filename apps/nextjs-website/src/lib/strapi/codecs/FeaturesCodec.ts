import * as t from 'io-ts/lib';
import { BannerLinkCodec } from './BannerLinkCodec';

export const FeaturesCodec = t.strict({
  title: t.string,
  items: t.array(BannerLinkCodec),
});
