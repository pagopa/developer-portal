import * as t from 'io-ts/lib';
import { BaseProductWithRelationsCodec } from './ProductCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { BaseApiDataListCodec } from './ApiDataListCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';

export const ApiDataListPageCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    product: t.strict({
      data: BaseProductWithRelationsCodec,
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
