import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { CaseHistories } from './types';

import { buildEnv } from '@/lib/buildEnv';

const makeStrapiCaseHistoriesPopulate = () =>
  qs.stringify({
    populate: {
      image: {
        populate: '*',
      },
      parts: {
        populate: '*',
      },
      products: {
        populate: ['logo'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchCaseHistories = (locale: string) =>
  fetchFromStrapi<CaseHistories>(
    'case-histories',
    makeStrapiCaseHistoriesPopulate()
  )(locale, buildEnv);
