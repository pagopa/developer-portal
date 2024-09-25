import * as E from 'fp-ts/lib/Either';
import { WebinarsCodec } from '@/lib/strapi/codecs/WebinarsCodec';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'title',
        description: 'description',
        slug: 'slug-1',
        bodyContent: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'bodyContent',
              },
            ],
          },
        ],
        playerSrc: 'https://playerSrc/1',
        startDatetime: '2024-03-25T23:00:00.000Z',
        endDatetime: '2024-03-27T23:00:00.000Z',
        isVisibleInList: true,
        subscribeParagraphLabel: 'subscribeParagraphLabel',
        createdAt: '2024-03-26T17:12:29.910Z',
        updatedAt: '2024-03-26T17:12:31.925Z',
        publishedAt: '2024-03-26T17:12:31.921Z',
        locale: 'it',
        coverImage: mediaRasterJson,
        webinarSpeakers: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'name',
                jobTitle: 'jobTitle',
                description: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'desc',
                      },
                    ],
                  },
                ],
                createdAt: '2024-03-26T17:10:49.863Z',
                updatedAt: '2024-03-26T17:12:37.276Z',
                publishedAt: '2024-03-26T17:12:37.274Z',
                locale: 'it',
                avatar: mediaRasterJson,
              },
            },
          ],
        },
        relatedLinks: {
          id: 2,
          title: 'title',
          links: [
            {
              id: 13,
              text: 'text',
              href: 'href',
              target: null,
            },
          ],
        },
        relatedResources: {
          id: 3,
          title: 'test',
          resources: [
            {
              id: 2,
              title: 'erererere',
              subtitle: 'sub 1',
              description: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'dsfsdf dsf sdf ',
                    },
                  ],
                },
              ],
              linkText: 'test',
              linkHref: 'http://localhost:3000/solutions',
              image: mediaRasterJson,
            },
          ],
          downloadableDocuments: {
            data: [
              {
                id: 7,
                attributes: {
                  name: 'AnalisiNextJSAppRouter.pdf',
                  alternativeText: null,
                  caption: null,
                  width: null,
                  height: null,
                  formats: null,
                  hash: 'Analisi_Next_JS_App_Router_f58eb6efb4',
                  ext: '.pdf',
                  mime: 'application/pdf',
                  size: 916.09,
                  url: 'http://localhost:1337/uploads/Analisi_Next_JS_App_Router_f58eb6efb4.pdf',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-custom',
                  provider_metadata: null,
                  createdAt: '2024-07-18T13:03:28.528Z',
                  updatedAt: '2024-07-18T13:03:28.528Z',
                },
              },
              {
                id: 6,
                attributes: {
                  name: 'group_by_ID_from_csv.py',
                  alternativeText: 'Test Script alt',
                  caption: 'Test Script cap',
                  width: null,
                  height: null,
                  formats: null,
                  hash: 'group_by_ID_from_csv_3911b88c0c',
                  ext: '.py',
                  mime: 'text/x-python',
                  size: 0.54,
                  url: 'http://localhost:1337/uploads/group_by_ID_from_csv_3911b88c0c.py',
                  previewUrl: null,
                  provider: 'strapi-provider-upload-custom',
                  provider_metadata: null,
                  createdAt: '2024-07-18T13:01:53.301Z',
                  updatedAt: '2024-07-18T13:01:53.301Z',
                },
              },
            ],
          },
        },
        questionsAndAnswers: [
          {
            id: 2,
            question: 'question',
            answer: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'answer',
                  },
                  {
                    type: 'text',
                    text: 'answer',
                    bold: true,
                  },
                  {
                    type: 'text',
                    text: 'answer',
                  },
                  {
                    type: 'link',
                    url: '/',
                    children: [
                      {
                        type: 'text',
                        text: 'answer',
                      },
                    ],
                  },
                  {
                    type: 'text',
                    text: 'answer',
                  },
                ],
              },
            ],
          },
        ],
        seo: null,
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

const makeStrapiResponseWithNullsJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'title',
        description: 'description',
        slug: 'slug-1',
        bodyContent: null,
        playerSrc: null,
        startDatetime: null,
        endDatetime: null,
        isVisibleInList: true,
        subscribeParagraphLabel: null,
        createdAt: '2024-03-26T17:12:29.910Z',
        updatedAt: '2024-03-26T17:12:31.925Z',
        publishedAt: '2024-03-26T17:12:31.921Z',
        locale: 'it',
        coverImage: mediaRasterJson,
        webinarSpeakers: {
          data: [],
        },
        relatedLinks: {
          id: 1,
          title: 'title',
          links: [
            {
              id: 1,
              text: 'text',
              href: 'href',
              target: null,
            },
          ],
        },
        relatedResources: null,
        questionsAndAnswers: [],
        seo: null,
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

describe('WebinarsCodec', () => {
  it('should decode Strapi webinars', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = WebinarsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode Strapi webinars with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseWithNullsJson();
    const actual = WebinarsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
