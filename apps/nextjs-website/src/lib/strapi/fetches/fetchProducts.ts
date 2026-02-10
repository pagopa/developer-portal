import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import qs from 'qs';
import { StrapiProducts } from '@/lib/strapi/types/product';

// TODO: divide this populate in more specific ones for query optimization
export const productRelationsPopulate = {
  populate: {
    logo: { populate: '*' },
    bannerLinks: {
      populate: ['icon'],
    },
    overview: {
      populate: '*',
    },
    quickstart_guide: {
      populate: '*',
    },
    release_note: {
      populate: '*',
    },
    api_data_list_page: {
      populate: '*',
    },
    guide_list_page: {
      populate: '*',
    },
    tutorial_list_page: {
      populate: '*',
    },
    use_case_list_page: {
      populate: '*',
    },
    tags: {
      populate: ['icon'],
    },
  },
};

const makeStrapiProductsPopulate = () =>
  qs.stringify({
    ...productRelationsPopulate,
  });

export const fetchProducts = fetchFromStrapi<StrapiProducts>(
  'products',
  makeStrapiProductsPopulate()
);
