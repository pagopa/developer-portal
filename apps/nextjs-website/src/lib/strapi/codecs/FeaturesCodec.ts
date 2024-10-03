import * as t from 'io-ts/lib';
import { BannerLinkCodec } from './BannerLinkCodec';
import { NullToUndefinedCodec } from '@/lib/strapi/codecs/NullToUndefinedCodec';

export const FeaturesCodec = t.strict({
  title: t.string,
  subtitle: t.union([NullToUndefinedCodec, t.string]),
  items: t.array(BannerLinkCodec),
});
