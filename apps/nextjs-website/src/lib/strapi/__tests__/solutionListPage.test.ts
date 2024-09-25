import * as E from 'fp-ts/lib/Either';
import { SolutionListPageCodec } from '../codecs/SolutionListPageCodec';
import { baseCaseHistoryJson } from './caseHistories.test';
import { baseSolutionJson } from '@/lib/strapi/__tests__/fixtures/solution';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';

const makeStrapiResponseJson = () => ({
  data: {
    id: 1,
    attributes: {
      title: 'test',
      description: 'sdfdfsdfsd',
      createdAt: '2024-07-24T09:21:10.194Z',
      updatedAt: '2024-07-24T10:45:18.577Z',
      publishedAt: '2024-07-24T09:21:10.856Z',
      locale: 'it',
      solutions: {
        data: [baseSolutionJson],
      },
      caseHistories: {
        id: 4,
        title: 'etew',
        description: 'dssasa',
        case_histories: {
          data: [baseCaseHistoryJson],
        },
      },
      features: {
        id: 3,
        title: 'dfdsfsfds',
        subtitle: null,
        items: [
          {
            id: 11,
            title: 'fsdfdsfsd',
            subtitle: 'subtitle',
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'sfdsfdsfdsfsd',
                  },
                ],
              },
            ],
            theme: 'light',
            icon: mediaRasterJson,
          },
          {
            id: 12,
            title: 'ffff',
            subtitle: 'subtitle',
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'fdsfsdfsdfdsfdsf',
                  },
                ],
              },
            ],
            theme: 'light',
            icon: mediaRasterJson,
          },
          {
            id: 13,
            title: 'dddd',
            subtitle: null,
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'fsdfdsfsd',
                  },
                ],
              },
            ],
            theme: 'light',
            icon: mediaRasterJson,
          },
        ],
      },
      seo: null,
    },
  },
  meta: {},
});

describe('SolutionListPageCodec', () => {
  it('should decode strapi SolutionListPageCodec', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = SolutionListPageCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
