import * as t from 'io-ts/lib';
import { BaseProductWithBannerLinksCodec } from './ProductCodec';
import { PaginationCodec } from './PaginationCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { BaseTutorialCodec } from './TutorialCodec';
import { SEOCodec } from './SeoCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const TutorialListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    tutorials: t.strict({ data: t.array(BaseTutorialCodec) }),
    bannerLinks: t.array(BannerLinkCodec),
    product: t.strict({ data: BaseProductWithBannerLinksCodec }),
    seo: t.union([NullToUndefinedCodec, SEOCodec]),
  }),
});

export const TutorialListPagesCodec = t.strict({
  data: t.array(TutorialListPageCodec),
  meta: PaginationCodec,
});

export type StrapiTutorialListPages = t.TypeOf<typeof TutorialListPagesCodec>;
