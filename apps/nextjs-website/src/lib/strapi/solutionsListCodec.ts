import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { SolutionCodec } from './solutionsCodec';
import { CaseHistoryCodec } from './caseHistoriesCodec';

export const StrapiSolutionsListCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      title: t.string,
      description: t.string,
      caseHistories: t.union([
        NullToUndefinedCodec,
        t.strict({
          title: t.string,
          description: t.union([NullToUndefinedCodec, t.string]),
          case_histories: t.strict({
            data: t.array(CaseHistoryCodec),
          }),
        }),
      ]),
      solutions: t.strict({
        data: t.array(SolutionCodec),
      }),
    }),
  }),
});

export type StrapiSolutionsList = t.TypeOf<typeof StrapiSolutionsListCodec>;

const makeStrapiSolutionsListPopulate = () =>
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
          'webinars.webinarSpeakers',
          'webinars.webinarSpeakers.avatar',
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
    },
  });

export const fetchSolutionsList = fetchFromStrapi(
  'solutions-list-page',
  makeStrapiSolutionsListPopulate(),
  StrapiSolutionsListCodec
);
