import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { PaginationCodec } from './PaginationCodec';
import { BaseProductWithBannerLinksCodec } from './ProductCodec';
import { PartCodec } from './PartCodec';

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
    product: t.strict({ data: BaseProductWithBannerLinksCodec }),
    quickstartGuideItems: t.strict({ data: t.array(QuickStartGuideItemCodec) }),
  }),
});

export const QuickStartGuidesCodec = t.strict({
  data: t.array(QuickStartGuideCodec),
  meta: PaginationCodec,
});

export type StrapiQuickStartGuides = t.TypeOf<typeof QuickStartGuidesCodec>;
