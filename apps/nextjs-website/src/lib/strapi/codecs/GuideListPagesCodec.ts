import * as t from 'io-ts/lib';
import { BaseGuideCodec } from './GuidesCodec';
import { BaseProductWithRelationsCodec } from './ProductCodec';
import { PaginationCodec } from './PaginationCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';

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
    product: t.strict({ data: BaseProductWithRelationsCodec }),
    guidesByCategory: t.array(GuideByCategoryCodec),
    bannerLinks: t.array(BannerLinkCodec),
    seo: t.union([NullToUndefinedCodec, SEOCodec]),
  }),
});

export const GuideListPagesCodec = t.strict({
  data: t.array(GuideListPageCodec),
  meta: PaginationCodec,
});

export type StrapiGuideListPages = t.TypeOf<typeof GuideListPagesCodec>;
