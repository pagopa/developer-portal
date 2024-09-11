import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { SolutionListPageCodec } from '@/lib/strapi/codecs/SolutionListPageCodec';

const makeStrapiSolutionListPagePopulate = () =>
  qs.stringify({
    populate: {
      solutions: {
        populate: [
          'bannerLinks',
          'bannerLinks.icon',
          'products.logo',
          'icon',
          'icon.name',
          'stats',
          'steps',
          'steps.products',
          'webinars',
          'webinars.coverImage',
          'webinars.questionsAndAnswers',
          'webinars.webinarSpeakers',
          'webinars.webinarSpeakers.avatar',
          'webinars.relatedResources.resources.image',
          'webinars.relatedResources.downloadableDocuments',
          'caseHistories',
          'caseHistories.case_histories',
          'caseHistories.case_histories.image',
          'caseHistories.case_histories.parts',
          'caseHistories.case_histories.parts.backgroundImage',
          'caseHistories.case_histories.products',
          'caseHistories.case_histories.products.logo',
        ],
      },
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
      features: {
        populate: ['items.icon'],
      },
    },
  });

export const fetchSolutionListPage = fetchFromStrapi(
  'solution-list-page',
  makeStrapiSolutionListPagePopulate(),
  SolutionListPageCodec
);
