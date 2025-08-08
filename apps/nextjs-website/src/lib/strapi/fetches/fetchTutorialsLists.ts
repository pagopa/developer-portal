import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiGuideListPage } from '@/lib/strapi/types/tutorialsList';

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

export const fetchTutorialsLists = fetchFromStrapi<StrapiGuideListPage>(
  'tutorial-list-pages',
  makeStrapiTutorialsListsPopulate()
);
