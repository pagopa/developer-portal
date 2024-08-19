import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { GuideBaseAttributesCodec } from './codecs/GuideCodec';
import { BaseProductCodec } from './codecs/ProductCodec';
import { PaginationCodec } from './codecs/PaginationCodec';

const GuideByCategoryCodec = t.strict({
  category: t.string,
  guides: t.strict({
    data: t.array(GuideBaseAttributesCodec),
  }),
});

const StrapiGuideListCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    product: t.strict({ data: BaseProductCodec }),
    guidesByCategory: t.array(GuideByCategoryCodec),
  }),
});

export const StrapiGuideListPagesCodec = t.strict({
  data: t.array(StrapiGuideListCodec),
  meta: PaginationCodec,
});

export type StrapiGuideListPages = t.TypeOf<typeof StrapiGuideListPagesCodec>;

const makeStrapiGuideListPopulate = () =>
  qs.stringify({
    populate: {
      product: '*',
      guidesByCategory: {
        populate: ['guides.mobileImage', 'guides.image', 'guides.listItems'],
      },
    },
  });

export const fetchGuideList = fetchFromStrapi(
  'guide-list-pages',
  makeStrapiGuideListPopulate(),
  StrapiGuideListPagesCodec
);
