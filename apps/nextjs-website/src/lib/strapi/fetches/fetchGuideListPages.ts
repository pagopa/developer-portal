import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';

const makeStrapiGuideListPopulate = () =>
  qs.stringify({
    populate: {
      product: {
        ...productRelationsPopulate,
      },
      guidesByCategory: {
        populate: ['guides.mobileImage', 'guides.image', 'guides.listItems'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchGuideListPages = fetchFromStrapi<StrapiGuideListPages>(
  'guide-list-pages',
  makeStrapiGuideListPopulate()
);
