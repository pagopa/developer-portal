import { StrapiHomepageCodec } from '@/lib/strapi/homepage';
import * as E from 'fp-ts/lib/Either';

const makeStrapiResponseJson = () => ({
  data: {
    id: 2,
    attributes: {
      createdAt: '2024-02-09T08:42:28.486Z',
      updatedAt: '2024-02-09T09:21:55.636Z',
      publishedAt: '2024-02-09T08:44:21.612Z',
      comingsoonDocumentation: {
        id: 4,
        title: 'aTitle',
        links: [
          {
            id: 5,
            text: 'aText',
            href: 'aUrl',
            target: '_self',
          },
          {
            id: 6,
            text: 'aText',
            href: 'aUrl',
            target: '_blank',
          },
          {
            id: 7,
            text: 'aText',
            href: 'aUrl',
            target: '_parent',
          },
          {
            id: 8,
            text: 'aText',
            href: 'aUrl',
            target: '_top',
          },
          {
            id: 9,
            text: 'aText',
            href: 'aUrl',
          },
        ],
      },
      heroSlider: [
        {
          id: 1,
          title: 'aText',
          titleColor: 'contrastText',
          callToAction: {
            id: 1,
            variant: 'text',
            link: {
              id: 9,
              text: 'aText',
              href: 'https://a-url.com',
              target: '_self',
            },
          },
          backgroundImage: {
            data: {
              id: 2,
              attributes: {
                name: 'a-image.png',
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
      ],
      productsShowcase: {
        id: 1,
        title: 'aText',
        products: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'aText',
                description: 'aText',
                slug: 'a-slug',
                createdAt: '2024-02-09T13:32:16.646Z',
                updatedAt: '2024-02-09T13:32:25.171Z',
                publishedAt: '2024-02-09T13:32:25.170Z',
                locale: 'it',
                logo: {
                  data: {
                    id: 2,
                    attributes: {
                      name: 'aFileName.svg',
                      alternativeText: null,
                      caption: null,
                      width: 60,
                      height: 61,
                      formats: null,
                      hash: 'a_file_name_714c6d0fd3',
                      ext: '.svg',
                      mime: 'image/svg+xml',
                      size: 1.9,
                      url: '/uploads/a_file_name_714c6d0fd3.svg',
                      previewUrl: null,
                      provider: 'local',
                      provider_metadata: null,
                      createdAt: '2024-02-07T17:29:12.923Z',
                      updatedAt: '2024-02-07T17:29:12.923Z',
                    },
                  },
                },
              },
            },
          ],
        },
        newsShowcase: {
          id: 1,
          title: 'aText',
          subTitle: null,
          items: {
            data: [
              {
                id: 2,
                attributes: {
                  title: 'aText',
                  createdAt: '2024-02-19T12:12:07.580Z',
                  updatedAt: '2024-02-21T10:24:18.509Z',
                  publishedAt: '2024-02-19T12:12:08.278Z',
                  locale: 'it',
                  comingSoon: false,
                  link: {
                    id: 4,
                    text: 'aText',
                    href: 'aText',
                    target: '_self',
                  },
                  image: {
                    data: {
                      id: 5,
                      attributes: {
                        name: 'aText',
                        alternativeText: null,
                        caption: null,
                        width: 1156,
                        height: 580,
                        formats: {
                          thumbnail: {
                            name: 'aText',
                            hash: 'aText',
                            ext: '.png',
                            mime: 'image/png',
                            path: null,
                            width: 245,
                            height: 123,
                            size: 14.83,
                            url: 'aText',
                          },
                          small: {
                            name: 'aText',
                            hash: 'aText',
                            ext: '.png',
                            mime: 'image/png',
                            path: null,
                            width: 500,
                            height: 251,
                            size: 50.41,
                            url: 'aText',
                          },
                          medium: {
                            name: 'aText',
                            hash: 'aText',
                            ext: '.png',
                            mime: 'image/png',
                            path: null,
                            width: 750,
                            height: 376,
                            size: 108.32,
                            url: 'aText',
                          },
                          large: {
                            name: 'aText',
                            hash: 'aText',
                            ext: '.png',
                            mime: 'image/png',
                            path: null,
                            width: 1000,
                            height: 502,
                            size: 188.94,
                            url: 'aText',
                          },
                        },
                        hash: 'aText',
                        ext: '.png',
                        mime: 'image/png',
                        size: 42.4,
                        url: 'aText',
                        previewUrl: null,
                        provider: 'local',
                        provider_metadata: null,
                        createdAt: '2024-02-19T12:12:03.952Z',
                        updatedAt: '2024-02-19T12:12:03.952Z',
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
  },
});

const makeStrapiResponseWithNullsJson = () => ({
  data: {
    id: 2,
    attributes: {
      createdAt: '2024-02-09T08:42:28.486Z',
      updatedAt: '2024-02-09T09:21:55.636Z',
      publishedAt: '2024-02-09T08:44:21.612Z',
      comingsoonDocumentation: {
        id: 4,
        title: 'aTitle',
        links: [
          {
            id: 5,
            text: 'aText',
            href: 'aUrl',
            target: '_self',
          },
          {
            id: 6,
            text: 'aText',
            href: 'aUrl',
            target: '_blank',
          },
          {
            id: 7,
            text: 'aText',
            href: 'aUrl',
            target: '_parent',
          },
          {
            id: 8,
            text: 'aText',
            href: 'aUrl',
            target: '_top',
          },
          {
            id: 9,
            text: 'aText',
            href: 'aUrl',
          },
        ],
      },
      heroSlider: [
        {
          id: 1,
          title: 'aText',
          titleColor: 'contrastText',
          callToAction: {
            id: 1,
            variant: 'text',
            link: {
              id: 9,
              text: 'aText',
              href: 'https://a-url.com',
              target: '_self',
            },
          },
          backgroundImage: { data: null },
        },
        {
          id: 1,
          title: 'aText',
          titleColor: null,
          callToAction: null,
          backgroundImage: {
            data: {
              id: 2,
              attributes: {
                name: 'a-image.png',
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
      ],
      productsShowcase: {
        id: 1,
        title: 'aText',
        products: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'aText',
                description: 'aText',
                slug: 'a-slug',
                createdAt: '2024-02-09T13:32:16.646Z',
                updatedAt: '2024-02-09T13:32:25.171Z',
                publishedAt: '2024-02-09T13:32:25.170Z',
                locale: 'it',
                logo: {
                  data: {
                    id: 2,
                    attributes: {
                      name: 'aFileName.svg',
                      alternativeText: null,
                      caption: null,
                      width: 60,
                      height: 61,
                      formats: null,
                      hash: 'a_file_name_714c6d0fd3',
                      ext: '.svg',
                      mime: 'image/svg+xml',
                      size: 1.9,
                      url: '/uploads/a_file_name_714c6d0fd3.svg',
                      previewUrl: null,
                      provider: 'local',
                      provider_metadata: null,
                      createdAt: '2024-02-07T17:29:12.923Z',
                      updatedAt: '2024-02-07T17:29:12.923Z',
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

describe('StrapiHomepageCodec', () => {
  it('should decode strapi homepage', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    // Verify all the values are parsed properly, especially the nullable (e.g. links[0].target)
    const actual = StrapiHomepageCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi homepage with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseWithNullsJson();
    const actual = StrapiHomepageCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
