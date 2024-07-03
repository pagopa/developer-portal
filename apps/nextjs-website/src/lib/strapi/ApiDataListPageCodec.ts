import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { ProductCodec } from './codecs/ProductCodec';
import { BannerLinkCodec } from './codecs/BannerLinkCodec';
import { ApiDataCodec } from './codecs/ApiDataCodec';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';

export const ApiDataListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    product: ProductCodec,
    api_data: t.array(ApiDataCodec),
    bannerLinks: t.array(BannerLinkCodec),
  }),
});

export const ApiDataListPagesCodec = t.strict({
  data: t.array(ApiDataListPageCodec),
});

export type ApiDataListPages = t.TypeOf<typeof ApiDataListPagesCodec>;

const makeApiListPagePopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchApiDataListPages = fetchFromStrapi(
  'api-list-pages',
  makeApiListPagePopulate(),
  ApiDataListPagesCodec
);
