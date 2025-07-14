import * as qs from 'qs';
import { fetchFromStrapiNew } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { StrapiGuidesPaginated } from '@/lib/strapi/types/guide';

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
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchGuideListPages = fetchFromStrapiNew<StrapiGuidesPaginated>(
  'guide-list-pages',
  makeStrapiGuideListPopulate()
);
