import * as t from 'io-ts/lib';
import { BaseProductCodec } from './ProductCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';
import { BaseApiDataListCodec } from './ApiDataListCodec';

export const ApiDataListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    product: t.strict({
      data: BaseProductCodec,
    }),
    apiData: BaseApiDataListCodec,
    bannerLinks: t.array(BannerLinkCodec),
    seo: t.union([NullToUndefinedCodec, SEOCodec]),
  }),
});

export const ApiDataListPagesCodec = t.strict({
  data: t.array(ApiDataListPageCodec),
});

export type StrapiApiDataListPages = t.TypeOf<typeof ApiDataListPagesCodec>;
