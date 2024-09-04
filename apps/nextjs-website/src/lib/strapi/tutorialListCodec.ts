import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { BaseProductCodec } from './codecs/ProductCodec';
import { PaginationCodec } from './codecs/PaginationCodec';
import { BaseTutorialCodec } from './tutorial';
import { BannerLinkCodec } from './codecs/BannerLinkCodec';

const StrapiTutorialListCodec = t.strict({
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
  data: t.array(StrapiTutorialListCodec),
  meta: PaginationCodec,
});

export type StrapiTutorialListPages = t.TypeOf<
  typeof StrapiTutorialListPagesCodec
>;

const makeStrapiTutorialListPopulate = () =>
  qs.stringify({
    populate: {
      product: '*',
      tutorials: {
        populate: ['image'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchTutorialList = fetchFromStrapi(
  'tutorial-list-pages',
  makeStrapiTutorialListPopulate(),
  StrapiTutorialListPagesCodec
);
