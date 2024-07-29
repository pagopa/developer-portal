import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { SolutionCodec } from './solutionsCodec';
import { FeaturesCodec } from './codecs/FeaturesCodec';
import { CaseHistoriesComponentCodec } from '@/lib/strapi/codecs/CaseHistoriesComponentCodec';

export const StrapiSolutionListCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      title: t.string,
      description: t.string,
      caseHistories: t.union([
        NullToUndefinedCodec,
        CaseHistoriesComponentCodec,
      ]),
      solutions: t.strict({
        data: t.array(SolutionCodec),
      }),
      features: t.union([NullToUndefinedCodec, FeaturesCodec]),
    }),
  }),
});

export type StrapiSolutionList = t.TypeOf<typeof StrapiSolutionListCodec>;

const makeStrapiSolutionListPopulate = () =>
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

export const fetchSolutionList = fetchFromStrapi(
  'solution-list-page',
  makeStrapiSolutionListPopulate(),
  StrapiSolutionListCodec
);
