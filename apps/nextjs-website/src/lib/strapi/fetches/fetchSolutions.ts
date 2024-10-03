import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/fetches/fetchWebinars';
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
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
      products: {
        populate: ['logo'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      webinars: webinarPopulate,
      caseHistories: {
        populate: ['case_histories', 'case_histories.image'],
      },
    },
  });

export const fetchSolutions = fetchFromStrapi(
  'solutions',
  makeStrapiSolutionsPopulate(),
  SolutionsCodec
);
