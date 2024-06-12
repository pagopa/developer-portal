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
      caseHistories: t.strict({
        title: t.string,
        description: t.union([NullToUndefinedCodec, t.string]),
        case_histories: t.strict({
          data: t.array(CaseHistoryCodec),
        }),
      }),
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
        populate: ['icon'],
      },
      caseHistories: {
        populate: {
          case_histories: '*',
        },
      },
    },
  });

export const fetchSolutionsList = fetchFromStrapi(
  'solutions-list-page',
  makeStrapiSolutionsListPopulate(),
  StrapiSolutionsListCodec
);
