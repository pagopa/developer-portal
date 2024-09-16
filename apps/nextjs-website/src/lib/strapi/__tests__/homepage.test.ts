import { HomepageCodec } from '@/lib/strapi/codecs/HomepageCodec';
import * as E from 'fp-ts/lib/Either';
import { NullToUndefinedCodec } from '../codecs/NullToUndefinedCodec';
import {
  mediaRasterAttributesJson,
  mediaRasterJson,
} from '@/lib/strapi/__tests__/fixtures/media';
import { productsJson } from '@/lib/strapi/__tests__/fixtures/product';

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
              image: mediaRasterAttributesJson,
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
          backgroundImage: mediaRasterJson,
        },
      ],
      ecosystem: {
        id: 1,
        title: 'Scopri il nostro ecosistema',
        productsTabName: 'Per i prodotti',
        solutionsTabName: 'Per le soluzioni',
        products: productsJson,
        solutions: {
          data: [
            {
              id: 1,
              attributes: {
                slug: 'solution-1',
                kickerTitle: 'Soluzione 1',
                title: 'Soluzione 1',
                description: null,
                dirName: 'adsfasdf',
                landingUseCaseFile: 'README.md',
                createdAt: '2024-05-31T09:16:33.274Z',
                updatedAt: '2024-05-31T09:16:50.894Z',
                publishedAt: '2024-05-31T09:16:50.890Z',
                locale: 'en',
                products: productsJson,
                bannerLinks: [
                  {
                    id: 1,
                    title: 'asdfdasf',
                    body: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'sdfsafd',
                          },
                        ],
                      },
                    ],
                    icon: mediaRasterJson,
                  },
                ],
                webinars: {
                  data: [
                    {
                      id: 1,
                      attributes: {
                        title: 'ciao',
                        slug: 'ciao',
                        playerSrc: null,
                        startDatetime: '2024-03-30T23:00:00.000Z',
                        endDatetime: '2024-04-29T22:00:00.000Z',
                        isVisibleInList: true,
                        subscribeParagraphLabel: null,
                        description:
                          'sadfsadfadsfsdgsadsadfasfnasnfjkasnfdsj nkjasdhf jksadjkf asjkf hasdjkafb jsfd asjfhjsa dfkhjas vhjdsa hjas chads cahjs fashjf hasd fhajs fah ahjs fjhs fahsfkaj fha vahd vahs dfajshf ajshf ashfd ashkd fhasj fjsha fhajs fas fahs fhas fhjas fhjas flash fhsa fhas fahslf ahsf ahjslf sahj ahaj vhja chjf fhalsf lashfj',
                        createdAt: '2024-03-28T17:04:44.854Z',
                        updatedAt: '2024-04-10T12:19:38.060Z',
                        publishedAt: '2024-03-28T17:05:00.681Z',
                        locale: 'en',
                        bodyContent: [
                          {
                            type: 'paragraph',
                            children: [
                              {
                                type: 'text',
                                text: 'dfgdfsg',
                              },
                            ],
                          },
                          {
                            type: 'paragraph',
                            children: [
                              {
                                type: 'text',
                                text: 'dsfgsdf',
                              },
                            ],
                          },
                        ],
                        coverImage: mediaRasterJson,
                        relatedLinks: null,
                        webinarSpeakers: {
                          data: [
                            {
                              id: 1,
                              attributes: {
                                name: 'Michele',
                                jobTitle: 'CEO',
                                description: [
                                  {
                                    type: 'paragraph',
                                    children: [
                                      {
                                        type: 'text',
                                        text: 'asdasdfdasf',
                                      },
                                    ],
                                  },
                                ],
                                createdAt: '2024-03-28T17:28:42.733Z',
                                updatedAt: '2024-03-28T17:28:46.140Z',
                                publishedAt: '2024-03-28T17:28:46.125Z',
                                locale: 'en',
                                avatar: mediaRasterJson,
                              },
                            },
                          ],
                        },
                        relatedResources: null,
                      },
                    },
                  ],
                },
                stats: [
                  {
                    id: 1,
                    title: 'sadf',
                    description: 'fsdfsdf',
                  },
                ],
                icon: mediaRasterJson,
                steps: [
                  {
                    id: 2,
                    title: 'step',
                    content: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'content',
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'content',
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'content',
                          },
                        ],
                      },
                    ],
                    products: productsJson,
                  },
                ],
              },
            },
          ],
        },
        solutionsCta: {
          id: 3,
          variant: 'text',
          link: {
            id: 4,
            text: 'Vai a soluzioni',
            href: '/solutions',
            target: '_self',
          },
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
              bodyContent: [
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
              coverImage: mediaRasterJson,
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
                      avatar: mediaRasterJson,
                    },
                  },
                ],
              },
              questionsAndAnswers: [],
              relatedResources: null,
            },
          },
        ],
      },
      seo: {
        id: 1,
        metaTitle: 'trrr',
        metaDescription:
          'lllll ma con 50 caratteriiiii lllll ma con 50 caratteriiiii lllll ma con 50 caratteriiiii ',
        keywords: 'sssss',
        metaRobots: 'bbbbbrr',
        structuredData: {
          boh: 'sisi',
        },
        metaViewport: 'sdfsdf',
        canonicalURL: 'sfsdf',
        metaImage: mediaRasterJson,
        metaSocial: [
          {
            id: 1,
            socialNetwork: 'Facebook',
            title: 'sdfrwe',
            description: 'rttt',
            card: 'xcvsd',
            site: 'sdfsdf',
            creator: 'sdfsd',
          },
          {
            id: 2,
            socialNetwork: 'Twitter',
            title: 'fg',
            description: 'fg',
            card: 'dfsd',
            site: 'fgg',
            creator: 'fdgfd',
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
                name: 'webinar-cover-io-remote-content.jpg',
                alternativeText: null,
                caption: null,
                width: 728,
                height: 416,
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
        },
      ],
      ecosystem: {
        id: 1,
        title: 'Scopri il nostro ecosistema',
        productsTabName: 'Per i prodotti',
        solutionsTabName: 'Per le soluzioni',
        products: productsJson,
        solutions: {
          data: [
            {
              id: 1,
              attributes: {
                slug: 'solution-1',
                kickerTitle: 'Soluzione 1',
                title: 'Soluzione 1',
                description: null,
                dirName: 'adsfasdf',
                landingUseCaseFile: 'README.md',
                createdAt: '2024-05-31T09:16:33.274Z',
                updatedAt: '2024-05-31T09:16:50.894Z',
                publishedAt: '2024-05-31T09:16:50.890Z',
                locale: 'en',
                icon: {
                  data: {
                    id: 1,
                    attributes: {
                      name: 'webinar-cover-pago-pa-multe.jpg',
                      alternativeText: null,
                      caption: null,
                      width: 728,
                      height: 416,
                      formats: {
                        thumbnail: {
                          name: 'thumbnail_webinar-cover-pago-pa-multe.jpg',
                          hash: 'thumbnail_webinar_cover_pago_pa_multe_db00b47553',
                          ext: '.jpg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 245,
                          height: 140,
                          size: 5.18,
                          url: '/uploads/thumbnail_webinar_cover_pago_pa_multe_db00b47553.jpg',
                        },
                        small: {
                          name: 'small_webinar-cover-pago-pa-multe.jpg',
                          hash: 'small_webinar_cover_pago_pa_multe_db00b47553',
                          ext: '.jpg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 500,
                          height: 286,
                          size: 14.85,
                          url: '/uploads/small_webinar_cover_pago_pa_multe_db00b47553.jpg',
                        },
                      },
                      hash: 'webinar_cover_pago_pa_multe_db00b47553',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      size: 26.69,
                      url: '/uploads/webinar_cover_pago_pa_multe_db00b47553.jpg',
                      previewUrl: null,
                      provider: 'local',
                      provider_metadata: null,
                      createdAt: '2024-03-21T17:11:46.709Z',
                      updatedAt: '2024-05-31T09:16:42.250Z',
                    },
                  },
                },
              },
            },
          ],
        },
        solutionsCta: {
          id: 3,
          variant: 'text',
          link: {
            id: 4,
            text: 'Vai a soluzioni',
            href: '/solutions',
            target: '_self',
          },
        },
      },
      newsShowcase: null,
      seo: null,
      webinars: { data: [] },
    },
  },
  meta: {},
});

describe('HomepageCodec', () => {
  it('should decode strapi homepage', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    // Verify all the values are parsed properly, especially the nullable (e.g. links[0].target)
    const actual = HomepageCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi homepage with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseWithNullsJson();
    const actual = HomepageCodec.decode(jsonFromStrapi);
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
