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
        data: [
          {
            id: 1,
            attributes: {
              slug: 'solution-1',
              kickerTitle: 'kickerTitle',
              title: 'Title Test',
              description: null,
              dirName: 'lAIZmjrusC6qV8ki9zsZ',
              landingUseCaseFile: 'README.md',
              createdAt: '2024-06-06T15:36:07.300Z',
              updatedAt: '2024-06-10T08:37:35.961Z',
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
                    url: 'http://localhost:1337/uploads/Screenshot_from_2024_05_29_14_15_04_8e9393832f.png',
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
      caseHistories: {
        id: 1,
        title: 'Stories',
        description: 'dsfsdf dfs sdff f sf asadf  ',
        case_histories: {
          data: [
            {
              id: 1,
              attributes: {
                slug: 'case-history-1',
                title: 'Case History',
                description: 'desc',
                createdAt: '2024-06-05T13:04:34.614Z',
                updatedAt: '2024-06-05T14:05:24.891Z',
                publishedAt: '2024-06-05T13:08:21.443Z',
                locale: 'it',
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
            },
          ],
        },
      },
    },
  },
  meta: {},
});

describe('StrapiSolutionsListCodec', () => {
  it('should decode strapi homepage', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiSolutionsListCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
