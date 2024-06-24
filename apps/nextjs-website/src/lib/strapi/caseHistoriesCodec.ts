import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { MediaCodec } from './codecs/MediaCodec';
import { PaginationCodec } from './codecs/PaginationCodec';
import { ProductCodec } from './codecs/ProductCodec';
import { PartCodec } from './codecs/PartCodec';

export const CaseHistoryCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    slug: t.string,
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    publishedAt: tt.DateFromISOString,
    image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    products: t.strict({
      data: t.array(ProductCodec),
    }),
    parts: t.array(PartCodec),
  }),
});

export const StrapiCaseHistoriesCodec = t.strict({
  data: t.array(CaseHistoryCodec),
  meta: PaginationCodec,
});

export type StrapiCaseHistories = t.TypeOf<typeof StrapiCaseHistoriesCodec>;

const makeStrapiCaseHistoriesPopulate = () =>
  qs.stringify({
    populate: {
      image: 'image',
      parts: {
        populate: [
          'responseCode',
          'requestCode',
          'requestAttributes',
          'backgroundImage',
        ],
      },
      products: {
        populate: ['logo'],
      },
    },
  });

export const fetchCaseHistories = fetchFromStrapi(
  'case-histories',
  makeStrapiCaseHistoriesPopulate(),
  StrapiCaseHistoriesCodec
);
