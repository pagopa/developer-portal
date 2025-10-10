import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiUseCaseListPages } from '../types/useCaseListPage';

const makeStrapiUseCaseListPagePopulate = () =>
  qs.stringify({
    populate: {
      bannerLinks: {
        populate: ['icon'],
      },
      enableFilters: true,
      product: {
        ...productRelationsPopulate,
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
      useCases: {
        populate: ['coverImage', 'product', 'tags'],
      },
    },
  });

export const fetchUseCaseListPages = fetchFromStrapi<StrapiUseCaseListPages>(
  'use-case-list-pages',
  makeStrapiUseCaseListPagePopulate()
);
