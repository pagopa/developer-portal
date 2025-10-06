import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiUseCaseListPages } from '../types/useCaseListPage';

const makeStrapiUseCaseListPagePopulate = () =>
  qs.stringify({
    populate: {
      product: {
        ...productRelationsPopulate,
      },
      useCases: {
        populate: ['image', 'product'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchUseCaseListPages = fetchFromStrapi<StrapiUseCaseListPages>(
  'use-case-list-pages',
  makeStrapiUseCaseListPagePopulate()
);
