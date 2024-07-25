import * as E from 'fp-ts/lib/Either';
import { StrapiCaseHistoriesCodec } from '../caseHistoriesCodec';

export const baseCaseHistoryJson = {
  id: 1,
  attributes: {
    slug: 'case-history-1',
    title: 'Case History',
    description: null,
    createdAt: '2024-06-05T13:04:34.614Z',
    updatedAt: '2024-06-05T13:11:07.933Z',
    publishedAt: '2024-06-05T13:08:21.443Z',
    locale: 'it',
    products: {
      data: [],
    },
    image: {
      data: null,
    },
    parts: [],
  },
};

const makeStrapiResponseJson = () => ({
  data: [
    {
      ...baseCaseHistoryJson,
      products: {
        data: [
          {
            id: 1,
            attributes: {
              name: 'CMS APP IO',
              description: 'Test desc ',
              slug: 'app-io',
              createdAt: '2024-02-15T09:57:22.179Z',
              updatedAt: '2024-02-27T11:13:34.014Z',
              publishedAt: '2024-02-15T09:57:24.401Z',
              locale: 'it',
              logo: {
                data: {
                  id: 1,
                  attributes: {
                    name: 'Screenshot from 2024-02-20 17-03-22.png',
                    alternativeText: null,
                    caption: null,
                    width: 2481,
                    height: 1919,
                    formats: {
                      thumbnail: {
                        name: 'thumbnail_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'thumbnail_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 202,
                        height: 156,
                        size: 5.63,
                        url: '/uploads/thumbnail_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                      large: {
                        name: 'large_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'large_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 1000,
                        height: 773,
                        size: 48.63,
                        url: '/uploads/large_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                      medium: {
                        name: 'medium_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'medium_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 750,
                        height: 580,
                        size: 33.57,
                        url: '/uploads/medium_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                      small: {
                        name: 'small_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'small_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 500,
                        height: 387,
                        size: 19.04,
                        url: '/uploads/small_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                    },
                    hash: 'Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                    ext: '.png',
                    mime: 'image/png',
                    size: 30.86,
                    url: '/uploads/Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                    previewUrl: null,
                    provider: 'local',
                    provider_metadata: null,
                    createdAt: '2024-02-27T10:11:20.913Z',
                    updatedAt: '2024-03-27T17:34:49.514Z',
                  },
                },
              },
            },
          },
          {
            id: 2,
            attributes: {
              name: 'CMS SEND - Servizio Notifiche Digitali',
              description: 'qualcosa qui ci va',
              slug: 'send',
              createdAt: '2024-02-15T10:17:38.945Z',
              updatedAt: '2024-02-27T11:13:25.275Z',
              publishedAt: '2024-02-15T10:30:06.457Z',
              locale: 'it',
              logo: {
                data: {
                  id: 1,
                  attributes: {
                    name: 'Screenshot from 2024-02-20 17-03-22.png',
                    alternativeText: null,
                    caption: null,
                    width: 2481,
                    height: 1919,
                    formats: {
                      thumbnail: {
                        name: 'thumbnail_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'thumbnail_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 202,
                        height: 156,
                        size: 5.63,
                        url: '/uploads/thumbnail_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                      large: {
                        name: 'large_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'large_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 1000,
                        height: 773,
                        size: 48.63,
                        url: '/uploads/large_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                      medium: {
                        name: 'medium_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'medium_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 750,
                        height: 580,
                        size: 33.57,
                        url: '/uploads/medium_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                      small: {
                        name: 'small_Screenshot from 2024-02-20 17-03-22.png',
                        hash: 'small_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                        ext: '.png',
                        mime: 'image/png',
                        path: null,
                        width: 500,
                        height: 387,
                        size: 19.04,
                        url: '/uploads/small_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                      },
                    },
                    hash: 'Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                    ext: '.png',
                    mime: 'image/png',
                    size: 30.86,
                    url: '/uploads/Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
                    previewUrl: null,
                    provider: 'local',
                    provider_metadata: null,
                    createdAt: '2024-02-27T10:11:20.913Z',
                    updatedAt: '2024-03-27T17:34:49.514Z',
                  },
                },
              },
            },
          },
        ],
      },
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
      parts: [
        {
          id: 1,
          __component: 'parts.alert',
          text: 'test',
          title: 'test',
          severity: 'warning',
        },
        {
          id: 1,
          __component: 'parts.api-tester',
          requestDescription: 'test',
          responseDescription: 'res',
          responseCode: {
            id: 3,
            code: 'code res',
            showLineNumbers: true,
            language: null,
          },
          requestCode: {
            id: 2,
            code: 'code',
            showLineNumbers: false,
            language: 'xml',
          },
          requestAttributes: [
            {
              id: 1,
              label: 'att',
              value: '1',
            },
          ],
        },
        {
          id: 1,
          __component: 'parts.code-block',
          code: 'code block',
          showLineNumbers: true,
          language: 'shell',
        },
        {
          id: 1,
          __component: 'parts.embed-html',
          html: '<div>test <u>test</u></div>',
        },
        {
          id: 1,
          __component: 'parts.html',
          html: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'fsdfdsf sfsdf sdf sdf sd',
                },
              ],
            },
          ],
        },
        {
          id: 1,
          __component: 'parts.quote',
          text: 'quote',
          backgroundImage: {
            data: {
              id: 2,
              attributes: {
                name: 'Screenshot from 2024-03-27 19-29-53.png',
                alternativeText: null,
                caption: null,
                width: 889,
                height: 451,
                formats: {
                  thumbnail: {
                    name: 'thumbnail_Screenshot from 2024-03-27 19-29-53.png',
                    hash: 'thumbnail_Screenshot_from_2024_03_27_19_29_53_29fe2538e2',
                    ext: '.png',
                    mime: 'image/png',
                    path: null,
                    width: 245,
                    height: 124,
                    size: 18.49,
                    url: '/uploads/thumbnail_Screenshot_from_2024_03_27_19_29_53_29fe2538e2.png',
                  },
                  small: {
                    name: 'small_Screenshot from 2024-03-27 19-29-53.png',
                    hash: 'small_Screenshot_from_2024_03_27_19_29_53_29fe2538e2',
                    ext: '.png',
                    mime: 'image/png',
                    path: null,
                    width: 500,
                    height: 254,
                    size: 56.07,
                    url: '/uploads/small_Screenshot_from_2024_03_27_19_29_53_29fe2538e2.png',
                  },
                  medium: {
                    name: 'medium_Screenshot from 2024-03-27 19-29-53.png',
                    hash: 'medium_Screenshot_from_2024_03_27_19_29_53_29fe2538e2',
                    ext: '.png',
                    mime: 'image/png',
                    path: null,
                    width: 750,
                    height: 380,
                    size: 111.47,
                    url: '/uploads/medium_Screenshot_from_2024_03_27_19_29_53_29fe2538e2.png',
                  },
                },
                hash: 'Screenshot_from_2024_03_27_19_29_53_29fe2538e2',
                ext: '.png',
                mime: 'image/png',
                size: 36.89,
                url: '/uploads/Screenshot_from_2024_03_27_19_29_53_29fe2538e2.png',
                previewUrl: null,
                provider: 'local',
                provider_metadata: null,
                createdAt: '2024-03-27T18:30:15.884Z',
                updatedAt: '2024-05-29T07:47:23.515Z',
              },
            },
          },
        },
      ],
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
  data: [baseCaseHistoryJson],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
});

describe('StrapiCaseHistoriesCodec', () => {
  it('should decode strapi case histories', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiCaseHistoriesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi case histories with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseJsonWithNull();
    const actual = StrapiCaseHistoriesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
