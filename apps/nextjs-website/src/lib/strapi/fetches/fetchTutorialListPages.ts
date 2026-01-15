import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';

const makeStrapiTutorialListPagePopulate = () =>
  qs.stringify({
    populate: {
      product: {
        ...productRelationsPopulate,
      },
      tutorials: {
        populate: ['image', 'product', 'tags'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchTutorialListPages = fetchFromStrapi<StrapiTutorialListPages>(
  'tutorial-list-pages',
  makeStrapiTutorialListPagePopulate()
);
