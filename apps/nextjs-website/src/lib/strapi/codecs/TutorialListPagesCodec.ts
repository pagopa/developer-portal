import * as t from 'io-ts/lib';
import { BaseProductCodec } from './ProductCodec';
import { PaginationCodec } from './PaginationCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { BaseTutorialCodec } from './TutorialCodec';

const StrapiTutorialListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    tutorials: t.strict({ data: t.array(BaseTutorialCodec) }),
    bannerLinks: t.array(BannerLinkCodec),
    product: t.strict({ data: BaseProductCodec }),
  }),
});

export const StrapiTutorialListPagesCodec = t.strict({
  data: t.array(StrapiTutorialListPageCodec),
  meta: PaginationCodec,
});

export type StrapiTutorialListPages = t.TypeOf<
  typeof StrapiTutorialListPagesCodec
>;