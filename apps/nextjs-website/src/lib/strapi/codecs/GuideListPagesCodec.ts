import * as t from 'io-ts/lib';
import { BaseGuideCodec } from './GuidesCodec';
import { BaseProductCodec } from './ProductCodec';
import { PaginationCodec } from './PaginationCodec';

const GuideByCategoryCodec = t.strict({
  category: t.string,
  guides: t.strict({
    data: t.array(BaseGuideCodec),
  }),
});

const GuideListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    product: t.strict({ data: BaseProductCodec }),
    guidesByCategory: t.array(GuideByCategoryCodec),
  }),
});

export const GuideListPagesCodec = t.strict({
  data: t.array(GuideListPageCodec),
  meta: PaginationCodec,
});

export type StrapiGuideListPages = t.TypeOf<typeof GuideListPagesCodec>;
