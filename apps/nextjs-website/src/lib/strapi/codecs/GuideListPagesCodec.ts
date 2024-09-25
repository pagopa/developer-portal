import * as t from 'io-ts/lib';
import { BaseGuideCodec } from './GuidesCodec';
import { BaseProductWithBannerLinksCodec } from './ProductCodec';
import { PaginationCodec } from './PaginationCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';

const GuideByCategoryCodec = t.strict({
  category: t.string,
  guides: t.strict({
    data: t.array(BaseGuideCodec),
  }),
});

export const GuideListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    product: t.strict({ data: BaseProductWithBannerLinksCodec }),
    guidesByCategory: t.array(GuideByCategoryCodec),
    seo: t.union([NullToUndefinedCodec, SEOCodec]),
  }),
});

export const GuideListPagesCodec = t.strict({
  data: t.array(GuideListPageCodec),
  meta: PaginationCodec,
});

export type StrapiGuideListPages = t.TypeOf<typeof GuideListPagesCodec>;
