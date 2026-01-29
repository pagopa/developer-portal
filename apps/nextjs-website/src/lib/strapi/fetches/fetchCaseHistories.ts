import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';

const makeStrapiCaseHistoriesPopulate = () =>
  qs.stringify({
    populate: {
      image: 'image',
      parts: {
        populate: [
          'responseCode',
          'requestCode',
          'requestAttributes',
          'backgroundImage',
        ],
      },
      products: {
        populate: ['logo'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchCaseHistories = fetchFromStrapi<StrapiCaseHistories>(
  'case-histories',
  makeStrapiCaseHistoriesPopulate()
);
