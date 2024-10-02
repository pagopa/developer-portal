import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { ProductsCodec } from '@/lib/strapi/codecs/ProductCodec';
import qs from 'qs';

const makeStrapiProductsPopulate = () => {
  return qs.stringify({
    populate: [
      'logo',
      'bannerLinks.icon',
      'overview',
      'quickstart_guide',
      'api_data_list_page',
      'api_data_list_page.apiData.*',
      'api_data_list_page.apiData.apiRestDetail.*',
      'guide_list_page',
      'tutorial_list_page',
    ],
  });
};

export const fetchProducts = fetchFromStrapi(
  'products',
  makeStrapiProductsPopulate(),
  ProductsCodec
);
