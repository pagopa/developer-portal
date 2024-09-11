import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { MediaCodec } from './MediaCodec';
import { PaginationCodec } from './PaginationCodec';
import { ProductCodec } from './ProductCodec';
import { PartCodec } from './PartCodec';
import { SEOCodec } from './SeoCodec';

export const CaseHistoryCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    slug: t.string,
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    publishedAt: tt.DateFromISOString,
    image: t.union([
      NullToUndefinedCodec,
      t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    ]),
    products: t.strict({
      data: t.array(ProductCodec),
    }),
    parts: t.array(PartCodec),
    seo: t.union([NullToUndefinedCodec, SEOCodec, t.undefined]),
  }),
});

export const CaseHistoriesCodec = t.strict({
  data: t.array(CaseHistoryCodec),
  meta: PaginationCodec,
});

export type StrapiCaseHistories = t.TypeOf<typeof CaseHistoriesCodec>;
