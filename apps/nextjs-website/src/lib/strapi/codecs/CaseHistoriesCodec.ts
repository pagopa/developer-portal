import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { MediaCodec } from './MediaCodec';
import { PaginationCodec } from './PaginationCodec';
import { ProductWithoutBannerLinksCodec } from './ProductCodec';
import { PartCodec } from './PartCodec';
import { SEOCodec } from './SeoCodec';

const BaseCaseHistoryAttributesCodec = t.strict({
  slug: t.string,
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
  publishedAt: tt.DateFromISOString,
  image: t.union([
    NullToUndefinedCodec,
    t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
  ]),
});

export const BaseCaseHistoryCodec = t.strict({
  id: t.number,
  attributes: BaseCaseHistoryAttributesCodec,
});

export const CaseHistoryCodec = t.strict({
  id: t.number,
  attributes: t.intersection([
    BaseCaseHistoryAttributesCodec,
    t.strict({
      products: t.strict({
        data: t.array(ProductWithoutBannerLinksCodec),
      }),
      parts: t.array(PartCodec),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  ]),
});

export const CaseHistoriesCodec = t.strict({
  data: t.array(CaseHistoryCodec),
  meta: PaginationCodec,
});

export type StrapiCaseHistories = t.TypeOf<typeof CaseHistoriesCodec>;
