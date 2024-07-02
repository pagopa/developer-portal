import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { ProductCodec } from './codecs/ProductCodec';
import { BannerLinkCodec } from './codecs/BannerLinkCodec';
import { ApiDataCodec } from './codecs/ApiDataCodec';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';

export const ApiListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    product: t.union([NullToUndefinedCodec, ProductCodec]),
    api_data: t.array(ApiDataCodec),
    bannerLinks: t.array(BannerLinkCodec),
  }),
});

export const ApiListPagesCodec = t.strict({
  data: t.array(ApiListPageCodec),
});

export type ApiListPages = t.TypeOf<typeof ApiListPagesCodec>;

const makeApiListPagePopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchApiListPages = fetchFromStrapi(
  'api-list-pages',
  makeApiListPagePopulate(),
  ApiListPagesCodec
);
