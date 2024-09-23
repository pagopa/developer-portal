import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { ProductsCodec } from '@/lib/strapi/codecs/ProductCodec';
import qs from 'qs';

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    populate: [
      'logo',
      'bannerLinks.icon',
      'overview',
      'quickstart_guide',
      'api_data_list_page',
      'guide_list_page',
      'tutorial_list_page',
    ],
  });

export const fetchProducts = fetchFromStrapi(
  'products',
  makeStrapiProductsPopulate(),
  ProductsCodec
);
