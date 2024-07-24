import * as E from 'fp-ts/lib/Either';
import { StrapiSolutionListCodec } from '../solutionListCodec';
import { baseSolutionJson } from './solutions.test';
import { baseCaseHistoryJson } from './caseHistories.test';

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
        items: [
          {
            id: 11,
            title: 'fsdfdsfsd',
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
            icon: {
              data: {
                id: 3,
                attributes: {
                  name: 'face.png',
                  alternativeText: null,
                  caption: null,
                  width: 320,
                  height: 320,
                  formats: null,
                  hash: 'face_f36a6f701f',
                  ext: '.png',
                  mime: 'image/png',
                  size: 0.98,
                  url: 'http://localhost:1337/uploads/face_f36a6f701f.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-custom',
                  provider_metadata: null,
                  createdAt: '2024-04-15T14:11:04.915Z',
                  updatedAt: '2024-04-15T14:11:04.915Z',
                },
              },
            },
          },
          {
            id: 12,
            title: 'ffff',
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
            icon: {
              data: {
                id: 3,
                attributes: {
                  name: 'face.png',
                  alternativeText: null,
                  caption: null,
                  width: 320,
                  height: 320,
                  formats: null,
                  hash: 'face_f36a6f701f',
                  ext: '.png',
                  mime: 'image/png',
                  size: 0.98,
                  url: 'http://localhost:1337/uploads/face_f36a6f701f.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-custom',
                  provider_metadata: null,
                  createdAt: '2024-04-15T14:11:04.915Z',
                  updatedAt: '2024-04-15T14:11:04.915Z',
                },
              },
            },
          },
          {
            id: 13,
            title: 'dddd',
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
            icon: {
              data: {
                id: 5,
                attributes: {
                  name: 'Screenshot from 2024-05-29 14-15-04.png',
                  alternativeText: null,
                  caption: null,
                  width: 83,
                  height: 86,
                  formats: null,
                  hash: 'Screenshot_from_2024_05_29_14_15_04_8e9393832f',
                  ext: '.png',
                  mime: 'image/png',
                  size: 0.51,
                  url: 'http://localhost:1337/uploads/Screenshot_from_2024_05_29_14_15_04_8e9393832f.png',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-custom',
                  provider_metadata: null,
                  createdAt: '2024-05-29T12:15:28.241Z',
                  updatedAt: '2024-07-17T14:59:45.174Z',
                },
              },
            },
          },
        ],
      },
    },
  },
  meta: {},
});

describe('StrapiSolutionsListCodec', () => {
  it('should decode strapi SolutionsList', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiSolutionListCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
