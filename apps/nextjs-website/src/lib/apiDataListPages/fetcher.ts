import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import { ApiDataListPages } from './types';
import { buildEnv } from '@/lib/buildEnv';

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

export const fetchApiDataListPages = (locale: string) =>
  fetchFromStrapi<ApiDataListPages>(
    'api-data-list-pages',
    makeStrapiApiDataListPagePopulate()
  )(locale, buildEnv);
