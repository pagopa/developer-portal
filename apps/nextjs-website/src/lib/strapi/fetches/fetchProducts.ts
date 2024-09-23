import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { ProductsCodec } from '@/lib/strapi/codecs/ProductCodec';
import qs from 'qs';

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    populate: ['logo', 'bannerLinks.icon'],
  });

export const fetchProducts = fetchFromStrapi(
  'products',
  makeStrapiProductsPopulate(),
  ProductsCodec
);
