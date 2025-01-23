import * as t from 'io-ts';
import { LinkCodec } from '@/lib/strapi/codecs/LinkCodec';
import * as tt from 'io-ts-types';
import { NullToUndefinedCodec } from '@/lib/strapi/codecs/NullToUndefinedCodec';
import { MediaCodec } from '@/lib/strapi/codecs/MediaCodec';

const NewsItemCodec = t.strict({
  attributes: t.strict({
    comingSoon: t.boolean,
    title: t.string,
    link: LinkCodec,
    publishedAt: tt.DateFromISOString,
    image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    label: t.union([NullToUndefinedCodec, t.string]),
  }),
});

export const NewsShowcaseCodec = t.strict({
  title: t.string,
  subTitle: t.union([NullToUndefinedCodec, t.string]),
  link: t.union([NullToUndefinedCodec, LinkCodec]),
  items: t.strict({
    data: t.array(NewsItemCodec),
  }),
});

export type NewsShowcase = t.TypeOf<typeof NewsShowcaseCodec>;
