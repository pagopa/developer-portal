import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import qs from 'qs';
import type { StrapiProducts } from './strapiTypes';
import { buildEnv } from '../buildEnv';

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

export const fetchProducts = (locale: string) =>
  fetchFromStrapi<StrapiProducts>('products', makeStrapiProductsPopulate())(
    locale,
    buildEnv
  );

export const fetchProductSlugsReader = (locale: string) =>
  fetchFromStrapi<StrapiProducts>(
    'products',
    qs.stringify({
      fields: ['slug', 'isVisible', 'updatedAt'],
      pagination: {
        limit: -1, // Fetch all records
      },
      filters: {
        isVisible: {
          $eq: true, // Only fetch visible products
        },
      },
    })
  )(locale, buildEnv);

export const fetchProductSinglePagesReader = (
  locale: string,
  productSlug: string
) =>
  fetchFromStrapi<StrapiProducts>(
    'products',
    qs.stringify({
      filters: {
        slug: {
          $eq: productSlug,
        },
      },
      fields: ['slug'],
      populate: {
        overview: { fields: ['updatedAt'] },
        quickstart_guide: { fields: ['updatedAt'] },
        tutorial_list_page: { fields: ['updatedAt'] },
        guide_list_page: { fields: ['updatedAt'] },
        release_note: { fields: ['updatedAt'] },
        api_data_list_page: { fields: ['updatedAt'] },
        use_case_list_page: { fields: ['updatedAt'] },
      },
      pagination: {
        limit: 1,
      },
    })
  )(locale, buildEnv);
