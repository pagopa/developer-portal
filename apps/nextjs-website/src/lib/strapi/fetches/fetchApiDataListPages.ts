import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';

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
    },
  });

export const fetchApiDataListPages = fetchFromStrapi<StrapiApiDataListPages>(
  'api-data-list-pages',
  makeStrapiApiDataListPagePopulate(),
);
