import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';

const BaseProductAttributesCodec = t.strict({
  name: t.string,
  shortName: t.string,
  slug: t.string,
});

const UrlCodec = t.strict({
  id: t.number,
  name: t.union([NullToUndefinedCodec, t.string]),
  url: t.string,
  hideTryIt: t.boolean,
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
                    specUrls: t.array(UrlCodec),
                  }),
                ]),
                apiSoapDetail: t.union([
                  NullToUndefinedCodec,
                  t.strict({
                    slug: t.string,
                    repositoryUrl: t.string,
                    dirName: t.string,
                  }),
                ]),
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

export const ProductRelationsCodec = t.strict({
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
  release_note: t.strict({
    data: t.union([NullToUndefinedCodec, t.strict({ id: t.number })]),
  }),
});

export const BaseProductWithRelationsCodec = t.strict({
  attributes: t.intersection([
    BaseProductAttributesCodec,
    ProductRelationsCodec,
    t.strict({
      bannerLinks: t.union([NullToUndefinedCodec, t.array(BannerLinkCodec)]),
    }),
  ]),
});

export const ProductWithoutBannerLinksCodec = t.strict({
  attributes: t.intersection([
    BaseProductAttributesCodec,
    t.strict({
      description: t.union([NullToUndefinedCodec, t.string]),
      logo: t.strict({ data: MediaCodec }),
    }),
  ]),
});

export const ProductCodec = t.strict({
  attributes: t.intersection([
    BaseProductAttributesCodec,
    ProductRelationsCodec,
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
    ProductRelationsCodec,
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

export type StrapiBaseProduct = t.TypeOf<typeof BaseProductCodec>;
export type BaseProductWithRelationsCodec = t.TypeOf<
  typeof BaseProductWithRelationsCodec
>;
export type StrapiProduct = t.TypeOf<typeof ProductCodec>;
export type StrapiProducts = t.TypeOf<typeof ProductsCodec>;
