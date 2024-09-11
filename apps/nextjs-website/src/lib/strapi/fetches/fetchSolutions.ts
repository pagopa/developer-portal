import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/webinars';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { SolutionsCodec } from '@/lib/strapi/codecs/SolutionsCodec';

const makeStrapiSolutionsPopulate = () =>
  qs.stringify({
    populate: {
      icon: 'icon',
      stats: '*',
      steps: {
        populate: {
          products: '*',
        },
      },
      products: {
        populate: ['logo'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      webinars: webinarPopulate,
      caseHistories: {
        populate: [
          'case_histories',
          'case_histories.image',
          'case_histories.parts',
          'case_histories.parts.backgroundImage',
          'case_histories.products',
          'case_histories.products.logo',
        ],
      },
    },
  });

export const fetchSolutions = fetchFromStrapi(
  'solutions',
  makeStrapiSolutionsPopulate(),
  SolutionsCodec
);
