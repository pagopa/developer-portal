import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import { StrapiTutorialListPages } from '@/lib/tutorialListPage/types';

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
