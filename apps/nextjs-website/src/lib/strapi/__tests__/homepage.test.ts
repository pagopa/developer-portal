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
      },
    },
  },
  meta: {},
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
