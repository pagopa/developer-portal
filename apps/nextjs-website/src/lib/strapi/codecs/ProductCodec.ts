import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';

const BaseProductAttributesCodec = t.strict({
  name: t.string,
  shortName: t.string,
  slug: t.string,
});

export const BaseProductCodec = t.strict({
  attributes: BaseProductAttributesCodec,
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

export const ProductsCodec = t.strict({
  data: t.array(ProductCodec),
});

export type BaseProduct = t.TypeOf<typeof BaseProductCodec>;
export type Product = t.TypeOf<typeof ProductCodec>;
export type Products = t.TypeOf<typeof ProductsCodec>;

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchProducts = fetchFromStrapi(
  'products',
  makeStrapiProductsPopulate(),
  ProductsCodec
);
