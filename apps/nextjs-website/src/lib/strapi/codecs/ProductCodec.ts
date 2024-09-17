import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';

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
      name: t.string,
      shortName: t.string,
      description: t.union([NullToUndefinedCodec, t.string]),
      slug: t.string,
      logo: t.strict({ data: MediaCodec }),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  ]),
});

export const ProductsCodec = t.strict({
  data: t.array(ProductCodec),
});

export type Products = t.TypeOf<typeof ProductsCodec>;

export type BaseProduct = t.TypeOf<typeof BaseProductCodec>;
export type Product = t.TypeOf<typeof ProductCodec>;

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchProducts = fetchFromStrapi(
  'products',
  makeStrapiProductsPopulate(),
  ProductsCodec
);
