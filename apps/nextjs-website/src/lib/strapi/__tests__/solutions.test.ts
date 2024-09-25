import * as E from 'fp-ts/lib/Either';
import { SolutionsCodec } from '../codecs/SolutionsCodec';
import { baseSolutionJson } from '@/lib/strapi/__tests__/fixtures/solution';
import {
  mediaRasterJson,
  mediaVectorJson,
} from '@/lib/strapi/__tests__/fixtures/media';

const makeStrapiResponseJson = () => ({
  data: [
    {
      ...baseSolutionJson,
      steps: [
        {
          id: 2,
          title: 'fdsdsfds',
          content: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'fdsfdssd',
                },
              ],
            },
          ],
          products: {
            data: [
              {
                id: 1,
                attributes: {
                  seo: null,
                  name: 'CMS APP IO',
                  description: 'Test desc ',
                  slug: 'app-io',
                  createdAt: '2024-02-15T09:57:22.179Z',
                  updatedAt: '2024-06-06T08:02:22.374Z',
                  publishedAt: '2024-02-15T09:57:24.401Z',
                  locale: 'it',
                },
              },
            ],
          },
        },
      ],
      stats: [
        {
          id: 1,
          title: 'fdsfdsfds',
          description: 'dsfsdfdssfsd',
        },
      ],
      statsSource:
        'Dati forniti da [Nome della fonte], aggiornati a [mese/anno].',
      bannerLinks: [
        {
          id: 1,
          title: 'dsfsdfs',
          body: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'sdffdsfs',
                },
              ],
            },
          ],
          icon: mediaVectorJson,
        },
      ],
      webinars: {
        data: [
          {
            id: 1,
            attributes: {
              title: 'Web 1',
              slug: 'web-1',
              playerSrc: 'https://vimeo.com/event/4153381/embed',
              startDatetime: '2024-04-09T16:15:00.000Z',
              endDatetime: '2024-04-09T16:30:00.000Z',
              isVisibleInList: true,
              subscribeParagraphLabel: 'fdsfdsfdsfds',
              description: 'dffdsfdfdfds ssssssssss',
              createdAt: '2024-03-27T17:35:40.463Z',
              updatedAt: '2024-05-09T10:03:34.276Z',
              publishedAt: '2024-03-27T17:39:33.483Z',
              locale: 'it',
              bodyContent: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'test bello con img',
                    },
                  ],
                },
                {
                  type: 'image',
                  image: mediaRasterJson,
                  children: [
                    {
                      type: 'text',
                      text: '',
                    },
                  ],
                },
              ],
              coverImage: mediaRasterJson,
              webinarSpeakers: {
                data: [
                  {
                    id: 1,
                    attributes: {
                      name: 'Bob',
                      jobTitle: 'Aggiustatutto',
                      description: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'Web',
                              bold: true,
                            },
                          ],
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'fdkmldlsdfm ',
                            },
                          ],
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'mfkldiolsdfmghkfgòl ',
                            },
                          ],
                        },
                      ],
                      createdAt: '2024-03-27T17:34:31.898Z',
                      updatedAt: '2024-04-15T14:11:09.553Z',
                      publishedAt: '2024-03-27T17:34:33.065Z',
                      locale: 'it',
                      avatar: mediaRasterJson,
                    },
                  },
                ],
              },
              relatedResources: null,
              seo: null,
            },
          },
        ],
      },
      products: {
        data: [
          {
            id: 1,
            attributes: {
              name: 'CMS APP IO',
              description: 'Test desc ',
              slug: 'app-io',
              createdAt: '2024-02-15T09:57:22.179Z',
              updatedAt: '2024-06-06T08:02:22.374Z',
              publishedAt: '2024-02-15T09:57:24.401Z',
              locale: 'it',
              logo: mediaRasterJson,
            },
          },
        ],
      },
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
});

const makeStrapiResponseJsonWithNull = () => ({
  data: [baseSolutionJson],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
});

describe('SolutionsCodec', () => {
  it('should decode strapi solutions', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = SolutionsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi solutions with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseJsonWithNull();
    const actual = SolutionsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
