import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import { StrapiUseCaseListPages } from './types';

const makeStrapiUseCaseListPagePopulate = () =>
  qs.stringify({
    populate: {
      bannerLinks: {
        populate: ['icon'],
      },
      product: {
        ...productRelationsPopulate,
      },
      seo: {
        populate: '*',
      },
      useCases: {
        populate: '*',
      },
    },
  });

export const fetchUseCaseListPages = fetchFromStrapi<StrapiUseCaseListPages>(
  'use-case-list-pages',
  makeStrapiUseCaseListPagePopulate()
);
