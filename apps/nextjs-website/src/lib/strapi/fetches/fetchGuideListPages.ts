import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { StrapiGuideLists } from '@/lib/strapi/types/guideList';

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

export const fetchGuideListPages = fetchFromStrapi<StrapiGuideLists>(
  'guide-list-pages',
  makeStrapiGuideListPopulate()
);
