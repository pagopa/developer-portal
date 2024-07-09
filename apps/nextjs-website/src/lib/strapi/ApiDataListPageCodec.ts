import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { BaseProductCodec } from './codecs/ProductCodec';
import { BannerLinkCodec } from './codecs/BannerLinkCodec';
import { ApiDataCodec } from './codecs/ApiDataCodec';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';

export const ApiDataListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    product: t.strict({
      data: t.union([NullToUndefinedCodec, BaseProductCodec]),
    }),
    apiData: t.strict({ data: t.array(ApiDataCodec) }),
    bannerLinks: t.array(BannerLinkCodec),
  }),
});

export const ApiDataListPagesCodec = t.strict({
  data: t.array(ApiDataListPageCodec),
});

export type ApiDataListPages = t.TypeOf<typeof ApiDataListPagesCodec>;

const makeApiDataListPagePopulate = () =>
  qs.stringify({
    populate: {
      apiData: {
        populate: {
          specUrls: {
            populate: '*',
          },
          icon: { populate: '*' },
          soapDocumentation: { populate: '*' },
        },
      },
      product: {
        populate: ['logo'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchApiDataListPages = fetchFromStrapi(
  'api-data-list-pages',
  makeApiDataListPagePopulate(),
  ApiDataListPagesCodec
);
