import * as E from 'fp-ts/lib/Either';
import { StrapiSolutionsCodec } from '../solutionsCodec';

export const baseSolutionJson = {
  id: 1,
  attributes: {
    slug: 'solution-1',
    kickerTitle: 'kickerTitle',
    title: 'Title Test',
    description: null,
    dirName: 'lAIZmjrusC6qV8ki9zsZ',
    landingUseCaseFile: 'README.md',
    createdAt: '2024-06-06T15:36:07.300Z',
    updatedAt: '2024-06-06T15:56:26.077Z',
    publishedAt: '2024-06-06T15:36:10.333Z',
    locale: 'it',
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
          url: '/uploads/Screenshot_from_2024_05_29_14_15_04_8e9393832f.png',
          previewUrl: null,
          provider: 'strapi-provider-upload-custom',
          provider_metadata: null,
          createdAt: '2024-05-29T12:15:28.241Z',
          updatedAt: '2024-06-06T15:35:44.363Z',
        },
      },
    },
    introductionToSteps: null,
    steps: [],
    stats: [],
    bannerLinks: [],
    products: {
      data: [],
    },
    webinars: {
      data: [],
    },
    caseHistories: {
      id: 12,
      title: 'Storie di successo',
      description: null,
      case_histories: {
        data: [
          {
            id: 3,
            attributes: {
              slug: 'slugdellacasehistory',
              title: 'Lorem ipsum dolor sit amet consectetur adipiscing el',
              description: 'Lorem ipsum dolor sit amet consectetur adipiscing',
              createdAt: '2024-06-12T13:24:05.128Z',
              updatedAt: '2024-07-02T13:12:21.780Z',
              publishedAt: '2024-06-12T13:24:27.231Z',
              locale: 'it',
              image: {
                data: null,
              },
              parts: [],
              products: {
                data: [
                  {
                    id: 2,
                    attributes: {
                      name: 'Firma con IO',
                      description: 'Lorem ipsum dolor sit amet',
                      slug: 'firma-con-io',
                      createdAt: '2024-02-16T10:14:15.098Z',
                      updatedAt: '2024-07-15T13:23:09.737Z',
                      publishedAt: '2024-02-16T10:14:16.646Z',
                      locale: 'it',
                      shortName: 'Firma con IO',
                      logo: {
                        data: {
                          id: 14,
                          attributes: {
                            name: 'file.svg',
                            alternativeText: null,
                            caption: null,
                            width: 60,
                            height: 61,
                            formats: null,
                            hash: 'file_31bf7a8135',
                            ext: '.svg',
                            mime: 'image/svg+xml',
                            size: 1.9,
                            url: 'http://localhost:1337/uploads/file_31bf7a8135.svg',
                            previewUrl: null,
                            provider: 'strapi-provider-upload-custom',
                            provider_metadata: null,
                            createdAt: '2024-06-27T12:35:19.232Z',
                            updatedAt: '2024-06-27T12:35:19.232Z',
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};

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
                url: '/uploads/Screenshot_from_2024_05_29_14_15_04_8e9393832f.png',
                previewUrl: null,
                provider: 'strapi-provider-upload-custom',
                provider_metadata: null,
                createdAt: '2024-05-29T12:15:28.241Z',
                updatedAt: '2024-06-06T15:35:44.363Z',
              },
            },
          },
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
                  image: {
                    name: 'Screenshot from 2024-03-27 19-29-53.png',
                    alternativeText: 'Screenshot from 2024-03-27 19-29-53.png',
                    url: '/uploads/Screenshot_from_2024_03_27_19_29_53_29fe2538e2.png',
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
                    previewUrl: null,
                    provider: 'local',
                    provider_metadata: null,
                    createdAt: '2024-03-27T18:30:15.884Z',
                    updatedAt: '2024-04-09T15:34:38.364Z',
                  },
                  children: [
                    {
                      type: 'text',
                      text: '',
                    },
                  ],
                },
              ],
              coverImage: {
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
                        url: '/uploads/thumbnail_webinar_cover_io_remote_content_62f1f615b5.jpg',
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
                        url: '/uploads/small_webinar_cover_io_remote_content_62f1f615b5.jpg',
                      },
                    },
                    hash: 'webinar_cover_io_remote_content_62f1f615b5',
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    size: 30.06,
                    url: '/uploads/webinar_cover_io_remote_content_62f1f615b5.jpg',
                    previewUrl: null,
                    provider: 'strapi-provider-upload-custom',
                    provider_metadata: null,
                    createdAt: '2024-04-15T14:25:47.773Z',
                    updatedAt: '2024-04-15T14:25:47.773Z',
                  },
                },
              },
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
                      avatar: {
                        data: {
                          id: 3,
                          attributes: {
                            name: 'face.png',
                            alternativeText: null,
                            caption: null,
                            width: 320,
                            height: 320,
                            formats: {
                              thumbnail: {
                                name: 'thumbnail_face.png',
                                hash: 'thumbnail_face_f36a6f701f',
                                ext: '.png',
                                mime: 'image/png',
                                path: null,
                                width: 156,
                                height: 156,
                                size: 7.59,
                                url: '/uploads/thumbnail_face_f36a6f701f.png',
                              },
                            },
                            hash: 'face_f36a6f701f',
                            ext: '.png',
                            mime: 'image/png',
                            size: 0.98,
                            url: '/uploads/face_f36a6f701f.png',
                            previewUrl: null,
                            provider: 'strapi-provider-upload-custom',
                            provider_metadata: null,
                            createdAt: '2024-04-15T14:11:04.915Z',
                            updatedAt: '2024-04-15T14:11:04.915Z',
                          },
                        },
                      },
                    },
                  },
                ],
              },
              relatedResources: null,
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
              logo: {
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
                    url: '/uploads/Screenshot_from_2024_05_29_14_15_04_8e9393832f.png',
                    previewUrl: null,
                    provider: 'strapi-provider-upload-custom',
                    provider_metadata: null,
                    createdAt: '2024-05-29T12:15:28.241Z',
                    updatedAt: '2024-06-06T15:35:44.363Z',
                  },
                },
              },
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

describe('StrapiSolutionsCodec', () => {
  it('should decode strapi solutions', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiSolutionsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi solutions with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseJsonWithNull();
    const actual = StrapiSolutionsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
