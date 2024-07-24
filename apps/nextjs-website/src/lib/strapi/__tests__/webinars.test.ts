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
              image: {
                data: {
                  id: 4,
                  attributes: {
                    name: 'webinar-cover-io-remote-content.jpg',
                    alternativeText: null,
                    caption: null,
                    width: 728,
                    height: 416,
                    formats: {
                      thumbnail: {
                        name: 'thumbnail_webinar-cover-io-remote-content.jpg',
                        hash: 'thumbnail_webinar_cover_io_remote_content_62f1f615b5',
                        ext: '.jpg',
                        mime: 'image/jpeg',
                        path: null,
                        width: 245,
                        height: 140,
                        size: 5.38,
                        url: 'http://localhost:1337/uploads/thumbnail_webinar_cover_io_remote_content_62f1f615b5.jpg',
                      },
                      small: {
                        name: 'small_webinar-cover-io-remote-content.jpg',
                        hash: 'small_webinar_cover_io_remote_content_62f1f615b5',
                        ext: '.jpg',
                        mime: 'image/jpeg',
                        path: null,
                        width: 500,
                        height: 286,
                        size: 16.03,
                        url: 'http://localhost:1337/uploads/small_webinar_cover_io_remote_content_62f1f615b5.jpg',
                      },
                    },
                    hash: 'webinar_cover_io_remote_content_62f1f615b5',
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    size: 30.06,
                    url: 'http://localhost:1337/uploads/webinar_cover_io_remote_content_62f1f615b5.jpg',
                    previewUrl: null,
                    provider: 'strapi-provider-upload-custom',
                    provider_metadata: null,
                    createdAt: '2024-04-15T14:25:47.773Z',
                    updatedAt: '2024-04-15T14:25:47.773Z',
                  },
                },
              },
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
        relatedResources: null,
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
