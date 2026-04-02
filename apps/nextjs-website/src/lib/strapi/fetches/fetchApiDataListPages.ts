import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const makeStrapiApiDataListPagePopulate = () =>
  qs.stringify({
    populate: {
      api_data: {
        populate: {
          apiRestDetail: {
            populate: '*',
          },
          apiSoapDetail: {
            populate: '*',
          },
          icon: { populate: '*' },
          product: { populate: 'logo' },
          tags: { populate: '*' },
        },
      },
      product: {
        ...productRelationsPopulate,
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchApiDataListPages = fetchFromStrapi<
  RootEntity<StrapiApiDataListPages>
>('api-data-list-pages', makeStrapiApiDataListPagePopulate());
