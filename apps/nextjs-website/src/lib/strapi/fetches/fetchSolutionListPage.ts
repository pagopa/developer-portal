import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiSolutionListPage } from '../types/solutionListPage';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const makeStrapiSolutionListPagePopulate = () =>
  qs.stringify({
    populate: {
      solutions: {
        populate: [
          'bannerLinks',
          'bannerLinks.icon',
          'products.logo',
          'icon',
          'stats',
          'steps',
          'steps.products',
          'webinars',
          'webinars.coverImage',
          'caseHistories',
          'caseHistories.case_histories',
          'caseHistories.case_histories.image',
        ],
      },
      caseHistories: {
        populate: ['case_histories', 'case_histories.image'],
      },
      features: {
        populate: ['items.icon'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchSolutionListPage = fetchFromStrapi<
  RootEntity<StrapiSolutionListPage>
>('solution-list-page', makeStrapiSolutionListPagePopulate());
