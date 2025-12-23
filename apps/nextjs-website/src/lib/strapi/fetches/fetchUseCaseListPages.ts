import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiUseCaseListPages } from '../types/useCaseListPage';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

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
