import { StrapiHomepageCodec } from '@/lib/strapi/homepage';
import * as E from 'fp-ts/lib/Either';
import { NullToUndefinedCodec } from '../codecs/NullToUndefinedCodec';

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
            target: null,
          },
        ],
      },
      heroSlider: [
        {
          id: 1,
          title: 'aText',
          subheadColor: 'contrastText',
          subhead: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'aText',
                },
                {
                  text: 'aText',
                  type: 'text',
                  bold: true,
                },
                {
                  text: 'aText',
                  type: 'text',
                  italic: true,
                },
                {
                  text: 'aText',
                  type: 'text',
                  underline: true,
                },
                {
                  text: 'aText',
                  type: 'text',
                  strikethrough: true,
                },
                {
                  text: 'aText',
                  type: 'text',
                  code: true,
                },
                {
                  text: 'aText',
                  type: 'text',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '',
                },
                {
                  type: 'link',
                  url: 'https://aLink.com',
                  children: [
                    {
                      type: 'text',
                      text: 'aText',
                    },
                  ],
                },
                {
                  text: '',
                  type: 'text',
                },
              ],
            },
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  text: 'aHeading',
                },
              ],
              level: 1,
            },
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  text: 'aHeading',
                },
              ],
              level: 2,
            },
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  text: 'aHeading',
                },
              ],
              level: 3,
            },
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  text: 'aHeading',
                },
              ],
              level: 4,
            },
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  text: 'aHeading',
                },
              ],
              level: 5,
            },
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  text: 'aHeading',
                },
              ],
              level: 6,
            },
            {
              type: 'list',
              format: 'ordered',
              children: [
                {
                  type: 'list-item',
                  children: [
                    {
                      type: 'text',
                      text: 'aText',
                    },
                  ],
                },
                {
                  type: 'list-item',
                  children: [
                    {
                      type: 'text',
                      text: 'aText',
                    },
                  ],
                },
              ],
            },
            {
              type: 'image',
              image: {
                name: 'a-image.jpg',
                alternativeText: 'a-image.jpg',
                url: 'http://localhost:1337/uploads/a-image.jpg',
                caption: null,
                width: 728,
                height: 416,
                formats: {
                  thumbnail: {
                    name: 'thumbnail_a-image.jpg',
                    hash: 'thumbnail_a_image_db00b47553',
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    path: null,
                    width: 245,
                    height: 140,
                    size: 5.18,
                    url: '/uploads/thumbnail_a_image_db00b47553.jpg',
                  },
                  small: {
                    name: 'small_a-image.jpg',
                    hash: 'small_a_image_db00b47553',
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    path: null,
                    width: 500,
                    height: 286,
                    size: 14.85,
                    url: '/uploads/small_a_image_db00b47553.jpg',
                  },
                },
                hash: 'a_image_db00b47553',
                ext: '.jpg',
                mime: 'image/jpeg',
                size: 26.69,
                previewUrl: null,
                provider: 'local',
                provider_metadata: null,
                createdAt: '2024-03-21T17:11:46.709Z',
                updatedAt: '2024-03-21T17:11:46.709Z',
              },
              children: [
                {
                  type: 'text',
                  text: '',
                },
              ],
            },
            {
              type: 'quote',
              children: [
                {
                  type: 'text',
                  text: 'aText',
                },
              ],
            },
            {
              type: 'code',
              children: [
                {
                  type: 'text',
                  text: 'aText',
                },
              ],
            },
          ],
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
      newsShowcase: null,
      webinars: {
        data: [
          {
            id: 1,
            attributes: {
              title: 'aText',
              slug: 'a-slug',
              textContent: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'aText',
                    },
                  ],
                },
              ],
              playerSrc: 'https://a-url.com',
              startDatetime: '2024-03-30T23:00:00.000Z',
              endDatetime: '2024-03-31T22:00:00.000Z',
              isVisibleInList: true,
              subscribeParagraphLabel: null,
              description: 'aText',
              createdAt: '2024-03-28T17:04:44.854Z',
              updatedAt: '2024-03-28T17:35:59.322Z',
              publishedAt: '2024-03-28T17:05:00.681Z',
              locale: 'en',
              coverImage: {
                data: {
                  id: 1,
                  attributes: {
                    name: 'a-image.jpg',
                    alternativeText: null,
                    caption: null,
                    width: 728,
                    height: 416,
                    formats: {
                      thumbnail: {
                        name: 'thumbnail_a-image.jpg',
                        hash: 'thumbnail_a_image_db00b47553',
                        ext: '.jpg',
                        mime: 'image/jpeg',
                        path: null,
                        width: 245,
                        height: 140,
                        size: 5.18,
                        url: '/uploads/thumbnail_a_image_db00b47553.jpg',
                      },
                    },
                    hash: 'a_image_db00b47553',
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    size: 26.69,
                    url: '/uploads/a_image_db00b47553.jpg',
                    previewUrl: null,
                    provider: 'local',
                    provider_metadata: null,
                    createdAt: '2024-03-21T17:11:46.709Z',
                    updatedAt: '2024-03-28T17:04:29.926Z',
                  },
                },
              },
              relatedLinks: null,
              webinarSpeakers: {
                data: [
                  {
                    id: 1,
                    attributes: {
                      name: 'aText',
                      jobTitle: 'aText',
                      description: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: 'aText',
                            },
                          ],
                        },
                      ],
                      createdAt: '2024-03-28T17:28:42.733Z',
                      updatedAt: '2024-03-28T17:28:46.140Z',
                      publishedAt: '2024-03-28T17:28:46.125Z',
                      locale: 'en',
                      avatar: {
                        data: {
                          id: 1,
                          attributes: {
                            name: 'a-image.jpg',
                            alternativeText: null,
                            caption: null,
                            width: 728,
                            height: 416,
                            formats: {
                              thumbnail: {
                                name: 'thumbnail_a-image.jpg',
                                hash: 'thumbnail_a_image_db00b47553',
                                ext: '.jpg',
                                mime: 'image/jpeg',
                                path: null,
                                width: 245,
                                height: 140,
                                size: 5.18,
                                url: '/uploads/thumbnail_a_image_db00b47553.jpg',
                              },
                            },
                            hash: 'webinar_a_image_db00b47553',
                            ext: '.jpg',
                            mime: 'image/jpeg',
                            size: 26.69,
                            url: '/uploads/a_image_db00b47553.jpg',
                            previewUrl: null,
                            provider: 'local',
                            provider_metadata: null,
                            createdAt: '2024-03-21T17:11:46.709Z',
                            updatedAt: '2024-03-28T17:04:29.926Z',
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
            target: null,
          },
        ],
      },
      heroSlider: [
        {
          id: 1,
          title: 'aText',
          titleColor: 'contrastText',
          subhead: null,
          subheadColor: null,
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
          subhead: null,
          subheadColor: null,
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
                alternativeText: null,
                caption: null,
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
      newsShowcase: null,
      webinars: { data: [] },
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

describe('NullToUndefinedCodec', () => {
  it('should decode null to undefined', () => {
    const actual = NullToUndefinedCodec.decode(null);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should encode undefined to null', () => {
    const actual = NullToUndefinedCodec.encode(undefined);
    expect(actual).toBeNull();
  });
});
