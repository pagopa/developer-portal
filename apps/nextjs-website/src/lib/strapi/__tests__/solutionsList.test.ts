import * as E from 'fp-ts/lib/Either';
import { StrapiSolutionsListCodec } from '../solutionsListCodec';

const makeStrapiResponseJson = () => ({
  data: {
    id: 1,
    attributes: {
      title: 'Solutions List',
      description: 'Solutions List page desc',
      createdAt: '2024-06-10T15:31:59.140Z',
      updatedAt: '2024-06-10T15:31:59.893Z',
      publishedAt: '2024-06-10T15:31:59.889Z',
      locale: 'it',
      solutions: {
        data: [],
      },
      caseHistories: {
        id: 1,
        title: 'Stories',
        description: 'dsfsdf dfs sdff f sf asadf  ',
        case_histories: {
          data: [],
        },
      },
    },
  },
  meta: {},
});

describe('StrapiSolutionsListCodec', () => {
  it('should decode strapi solutionsList', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiSolutionsListCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
