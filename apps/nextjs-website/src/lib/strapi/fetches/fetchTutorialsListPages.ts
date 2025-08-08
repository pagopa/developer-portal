import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';

const makeStrapiTutorialsListsPopulate = () =>
  qs.stringify({
    populate: {
      product: {
        ...productRelationsPopulate,
      },
      tutorials: {
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

export const fetchTutorialsListPages = fetchFromStrapi<StrapiTutorialListPages>(
  'tutorial-list-pages',
  makeStrapiTutorialsListsPopulate()
);
