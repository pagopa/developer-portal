import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { ProductCodec } from './codecs/ProductCodec';
import { BannerLinkCodec } from './codecs/BannerLinkCodec';
import { ApiDataCodec } from './codecs/ApiDataCodec';
import { fetchFromStrapi } from './fetchFromStrapi';

export const ApiListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    product: ProductCodec,
    api_data: ApiDataCodec,
    bannerLinks: t.array(BannerLinkCodec),
  }),
});

export type ApiListPage = t.TypeOf<typeof ApiListPageCodec>;

const makeApiListPagePopulate = () =>
  qs.stringify({
    populate: {
      api_data: {
        populate: ['image'],
      },
    },
  });

export const fetchApiListPages = fetchFromStrapi(
  'api-list-pages',
  makeApiListPagePopulate(),
  ApiListPageCodec
);
