import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';

const BaseProductAttributesCodec = t.strict({
  name: t.string,
  shortName: t.string,
  slug: t.string,
});

// To avoid circular dependencies, we must use the following codec:
const ApiDataListPageCodec = t.strict({
  data: t.union([
    NullToUndefinedCodec,
    t.strict({
      id: t.number,
      attributes: t.strict({
        apiData: t.strict({
          data: t.array(
            t.strict({
              id: t.number,
              attributes: t.strict({
                apiRestDetail: t.union([
                  NullToUndefinedCodec,
                  t.strict({
                    slug: t.string,
                  }),
                ]),
                apiSoapUrl: t.union([NullToUndefinedCodec, t.string]),
              }),
            })
          ),
        }),
      }),
    }),
  ]),
});

export const BaseProductCodec = t.strict({
  attributes: BaseProductAttributesCodec,
});

export const ProductRelationshipsCodec = t.strict({
  overview: t.strict({
    data: t.union([NullToUndefinedCodec, t.strict({ id: t.number })]),
  }),
  quickstart_guide: t.strict({
    data: t.union([NullToUndefinedCodec, t.strict({ id: t.number })]),
  }),
  api_data_list_page: ApiDataListPageCodec,
  tutorial_list_page: t.strict({
    data: t.union([NullToUndefinedCodec, t.strict({ id: t.number })]),
  }),
  guide_list_page: t.strict({
    data: t.union([NullToUndefinedCodec, t.strict({ id: t.number })]),
  }),
});

export const BaseProductWithBannerLinksCodec = t.strict({
  attributes: t.intersection([
    BaseProductAttributesCodec,
    t.strict({
      bannerLinks: t.union([NullToUndefinedCodec, t.array(BannerLinkCodec)]),
    }),
  ]),
});

export const ProductCodec = t.strict({
  attributes: t.intersection([
    BaseProductAttributesCodec,
    t.strict({
      description: t.union([NullToUndefinedCodec, t.string]),
      logo: t.strict({ data: MediaCodec }),
      bannerLinks: t.union([NullToUndefinedCodec, t.array(BannerLinkCodec)]),
    }),
  ]),
});

export const ProductWithRelationshipsCodec = t.strict({
  attributes: t.intersection([
    BaseProductAttributesCodec,
    ProductRelationshipsCodec,
    t.strict({
      description: t.union([NullToUndefinedCodec, t.string]),
      logo: t.strict({ data: MediaCodec }),
      bannerLinks: t.union([NullToUndefinedCodec, t.array(BannerLinkCodec)]),
    }),
  ]),
});

export const ProductsCodec = t.strict({
  data: t.array(ProductCodec),
});

export type BaseProduct = t.TypeOf<typeof BaseProductCodec>;
export type Product = t.TypeOf<typeof ProductCodec>;
export type Products = t.TypeOf<typeof ProductsCodec>;
