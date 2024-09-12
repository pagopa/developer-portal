import * as t from 'io-ts/lib';
import { BaseProductCodec } from './ProductCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { ApiDataListCodec } from './ApiDataListCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const ApiDataListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    product: t.strict({
      data: t.union([NullToUndefinedCodec, BaseProductCodec]),
    }),
    apiData: ApiDataListCodec,
    bannerLinks: t.array(BannerLinkCodec),
  }),
});

export const ApiDataListPagesCodec = t.strict({
  data: t.array(ApiDataListPageCodec),
});

export type StrapiApiDataListPages = t.TypeOf<typeof ApiDataListPagesCodec>;
