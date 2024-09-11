import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { PaginationCodec } from './PaginationCodec';
import { ProductCodec } from './ProductCodec';
import { PartCodec } from './PartCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';

const QuickStartGuideItemCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    anchor: t.string,
    publishedAt: tt.DateFromISOString,
    parts: t.array(PartCodec),
  }),
});

export const QuickStartGuideCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    product: t.strict({ data: ProductCodec }),
    quickstartGuideItems: t.strict({ data: t.array(QuickStartGuideItemCodec) }),
    seo: t.union([NullToUndefinedCodec, SEOCodec, t.undefined]),
  }),
});

export const QuickStartGuidesCodec = t.strict({
  data: t.array(QuickStartGuideCodec),
  meta: PaginationCodec,
});

export type StrapiQuickStartGuides = t.TypeOf<typeof QuickStartGuidesCodec>;
