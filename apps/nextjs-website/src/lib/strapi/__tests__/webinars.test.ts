import * as E from 'fp-ts/lib/Either';
import { StrapiWebinarsCodec } from '@/lib/strapi/webinars';

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
        coverImage: {
          data: {
            id: 1,
            attributes: {
              name: 'a-image.png',
              alternativeText: null,
              caption: null,
              width: 1440,
              height: 495,
              hash: 'image_52d70c707f',
              ext: '.png',
              mime: 'image/png',
              url: '/uploads/image_52d70c707f.png',
            },
          },
        },
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
                avatar: {
                  data: {
                    id: 1,
                    attributes: {
                      name: 'a-image.png',
                      alternativeText: null,
                      caption: null,
                      width: 1440,
                      height: 495,
                      hash: 'image_52d70c707f',
                      ext: '.png',
                      mime: 'image/png',
                      url: '/uploads/image_52d70c707f.png',
                    },
                  },
                },
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
        coverImage: {
          data: {
            id: 1,
            attributes: {
              name: 'image.png',
              alternativeText: null,
              caption: null,
              width: 100,
              height: 100,
              hash: 'image',
              ext: '.png',
              mime: 'image/png',
              url: '/uploads/image.png',
            },
          },
        },
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
        questionsAndAnswers: [],
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

describe('StrapiWebinarsCodec', () => {
  it('should decode strapi webinars', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiWebinarsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi webinars with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseWithNullsJson();
    const actual = StrapiWebinarsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
