import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { ProductsCodec } from '@/lib/strapi/codecs/ProductCodec';
import qs from 'qs';

// TODO: divide this populate in more specific ones for query optimization
export const productRelationsPopulate = {
  populate: [
    'logo',
    'bannerLinks.icon',
    'overview',
    'quickstart_guide',
    'release_note',
    'api_data_list_page',
    'api_data_list_page.apiData.*',
    'api_data_list_page.apiData.apiRestDetail.slug',
    'api_data_list_page.apiData.apiRestDetail.specUrls',
    'api_data_list_page.apiData.apiSoapDetail.*',
    'guide_list_page',
    'tutorial_list_page',
  ],
};

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    ...productRelationsPopulate,
  });

export const fetchProducts = (locale?: string) =>
  fetchFromStrapi(
    'products',
    makeStrapiProductsPopulate(),
    ProductsCodec,
    locale
  );
