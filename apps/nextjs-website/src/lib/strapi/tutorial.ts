import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { MediaCodec } from './codecs/MediaCodec';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';

const BannerLinkCodec = t.strict({
  id: t.number,
  title: t.union([NullToUndefinedCodec, t.string]),
  body: t.union([NullToUndefinedCodec, BlocksContentCodec]),
});

const RelatedLinksCodec = t.strict({
  id: t.number,
  title: t.string,
});

const ProductCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    name: t.string,
    description: t.string,
    slug: t.string,
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
    publishedAt: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    locale: t.string,
  }),
});

export const TutorialCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    slug: t.string,
    content: t.union([NullToUndefinedCodec, BlocksContentCodec]),
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
    publishedAt: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    locale: t.string,
    image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    bannerLinks: t.array(BannerLinkCodec),
    relatedLinks: RelatedLinksCodec,
    product: t.strict({ data: ProductCodec }),
  }),
});

const PaginationCodec = t.strict({
  pagination: t.strict({
    page: t.number,
    pageSize: t.number,
    pageCount: t.number,
    total: t.number,
  }),
});

export const StrapiTutorialsCodec = t.strict({
  data: t.array(TutorialCodec),
  meta: PaginationCodec,
});

export type StrapiTutorials = t.TypeOf<typeof StrapiTutorialsCodec>;

const makeStrapiTutorialsPopulate = () =>
  qs.stringify({
    populate: 'image,bannerLinks,relatedLinks,product',
  });

export const fetchTutorials = fetchFromStrapi(
  'tutorials',
  makeStrapiTutorialsPopulate(),
  StrapiTutorialsCodec
);
