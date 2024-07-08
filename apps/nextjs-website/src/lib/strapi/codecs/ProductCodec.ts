import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';

export const ProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    slug: t.string,
    logo: t.strict({ data: MediaCodec }),
  }),
});

export const ProductsCodec = t.strict({
  data: t.array(ProductCodec),
});

export type Products = t.TypeOf<typeof ProductsCodec>;

export const BaseProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    slug: t.string,
  }),
});

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchProducts = fetchFromStrapi(
  'products',
  makeStrapiProductsPopulate(),
  ProductsCodec
);
