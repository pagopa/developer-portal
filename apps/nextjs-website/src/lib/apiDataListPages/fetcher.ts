import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { ApiDataListPages } from './types';
import { buildEnv } from '@/lib/buildEnv';

const makeStrapiApiDataListPagePopulate = () =>
  qs.stringify({
    populate: {
      apiData: {
        populate: {
          apiRestDetail: {
            populate: ['slug', 'specUrls'],
          },
          apiSoapDetail: {
            populate: ['slug', 'repositoryUrl', 'dirName'],
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
        populate: '*,metaImage,metaSocial.image',
      },
      enableFilters: true,
    },
  });

export const fetchApiDataListPages = (locale: string) =>
  fetchFromStrapi<ApiDataListPages>(
    'api-data-list-pages',
    makeStrapiApiDataListPagePopulate()
  )(locale, buildEnv);
