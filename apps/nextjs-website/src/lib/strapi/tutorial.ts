import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { MediaCodec } from './codecs/MediaCodec';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { PaginationCodec } from './codecs/PaginationCodec';
import { ProductCodec } from './codecs/ProductCodec';
import { RelatedLinksCodec } from './codecs/RelatedLinksCodec';
import { PartCodec } from './codecs/PartCodec';

const BannerLinkCodec = t.strict({
  id: t.number,
  title: t.union([NullToUndefinedCodec, t.string]),
  content: t.union([NullToUndefinedCodec, BlocksContentCodec]),
});

export const BaseTutorialCodec = t.strict({
  attributes: t.strict({
    title: t.string,
    slug: t.string,
    image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
  }),
});

export const TutorialCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    slug: t.string,
    parts: t.array(PartCodec),
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
    publishedAt: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    locale: t.string,
    image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    bannerLinks: t.union([NullToUndefinedCodec, t.array(BannerLinkCodec)]),
    relatedLinks: t.union([NullToUndefinedCodec, RelatedLinksCodec]),
    product: t.strict({ data: ProductCodec }),
  }),
});

export const StrapiTutorialsCodec = t.strict({
  data: t.array(TutorialCodec),
  meta: PaginationCodec,
});

export type StrapiTutorials = t.TypeOf<typeof StrapiTutorialsCodec>;

const makeStrapiTutorialsPopulate = () =>
  qs.stringify({
    populate: {
      relatedLinks: {
        populate: ['links'],
      },
      image: {
        populate: ['image'],
      },
      parts: '*',
      product: { populate: 'logo' },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchTutorials = fetchFromStrapi(
  'tutorials',
  makeStrapiTutorialsPopulate(),
  StrapiTutorialsCodec
);
