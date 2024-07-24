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
      ecosystem: {
        id: 1,
        title: 'Scopri il nostro ecosistema',
        productsTabName: 'Per i prodotti',
        solutionsTabName: 'Per le soluzioni',
        products: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'IO',
                shortName: 'IO',
                description: null,
                slug: 'app-io',
                createdAt: '2024-05-24T07:45:13.658Z',
                updatedAt: '2024-05-24T07:58:24.107Z',
                publishedAt: '2024-05-24T07:45:20.231Z',
                locale: 'en',
                logo: {
                  data: {
                    id: 2,
                    attributes: {
                      name: 'minestrone-soup-500x500.jpg',
                      alternativeText: null,
                      caption: null,
                      width: 500,
                      height: 500,
                      formats: {
                        thumbnail: {
                          name: 'thumbnail_minestrone-soup-500x500.jpg',
                          hash: 'thumbnail_minestrone_soup_500x500_582b21c155',
                          ext: '.jpg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 156,
                          height: 156,
                          size: 8.66,
                          url: '/uploads/thumbnail_minestrone_soup_500x500_582b21c155.jpg',
                        },
                      },
                      hash: 'minestrone_soup_500x500_582b21c155',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      size: 51.82,
                      url: '/uploads/minestrone_soup_500x500_582b21c155.jpg',
                      previewUrl: null,
                      provider: 'local',
                      provider_metadata: null,
                      createdAt: '2024-04-08T16:05:13.531Z',
                      updatedAt: '2024-04-08T16:05:13.531Z',
                    },
                  },
                },
              },
            },
          ],
        },
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
                products: {
                  data: [
                    {
                      id: 1,
                      attributes: {
                        name: 'IO',
                        shortName: 'IO',
                        description: null,
                        slug: 'app-io',
                        createdAt: '2024-05-24T07:45:13.658Z',
                        updatedAt: '2024-05-24T07:58:24.107Z',
                        publishedAt: '2024-05-24T07:45:20.231Z',
                        locale: 'en',
                        logo: {
                          data: {
                            id: 2,
                            attributes: {
                              name: 'minestrone-soup-500x500.jpg',
                              alternativeText: null,
                              caption: null,
                              width: 500,
                              height: 500,
                              formats: {
                                thumbnail: {
                                  name: 'thumbnail_minestrone-soup-500x500.jpg',
                                  hash: 'thumbnail_minestrone_soup_500x500_582b21c155',
                                  ext: '.jpg',
                                  mime: 'image/jpeg',
                                  path: null,
                                  width: 156,
                                  height: 156,
                                  size: 8.66,
                                  url: '/uploads/thumbnail_minestrone_soup_500x500_582b21c155.jpg',
                                },
                              },
                              hash: 'minestrone_soup_500x500_582b21c155',
                              ext: '.jpg',
                              mime: 'image/jpeg',
                              size: 51.82,
                              url: '/uploads/minestrone_soup_500x500_582b21c155.jpg',
                              previewUrl: null,
                              provider: 'local',
                              provider_metadata: null,
                              createdAt: '2024-04-08T16:05:13.531Z',
                              updatedAt: '2024-04-08T16:05:13.531Z',
                            },
                          },
                        },
                      },
                    },
                  ],
                },
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
                        coverImage: {
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
                                avatar: {
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
                    products: {
                      data: [
                        {
                          id: 1,
                          attributes: {
                            name: 'IO',
                            shortName: 'IO',
                            description: null,
                            slug: 'app-io',
                            createdAt: '2024-05-24T07:45:13.658Z',
                            updatedAt: '2024-05-24T07:58:24.107Z',
                            publishedAt: '2024-05-24T07:45:20.231Z',
                            locale: 'en',
                            logo: {
                              data: {
                                id: 2,
                                attributes: {
                                  name: 'minestrone-soup-500x500.jpg',
                                  alternativeText: null,
                                  caption: null,
                                  width: 500,
                                  height: 500,
                                  formats: {
                                    thumbnail: {
                                      name: 'thumbnail_minestrone-soup-500x500.jpg',
                                      hash: 'thumbnail_minestrone_soup_500x500_582b21c155',
                                      ext: '.jpg',
                                      mime: 'image/jpeg',
                                      path: null,
                                      width: 156,
                                      height: 156,
                                      size: 8.66,
                                      url: '/uploads/thumbnail_minestrone_soup_500x500_582b21c155.jpg',
                                    },
                                  },
                                  hash: 'minestrone_soup_500x500_582b21c155',
                                  ext: '.jpg',
                                  mime: 'image/jpeg',
                                  size: 51.82,
                                  url: '/uploads/minestrone_soup_500x500_582b21c155.jpg',
                                  previewUrl: null,
                                  provider: 'local',
                                  provider_metadata: null,
                                  createdAt: '2024-04-08T16:05:13.531Z',
                                  updatedAt: '2024-04-08T16:05:13.531Z',
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
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
              relatedResources: null,
              questionsAndAnswers: [],
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
      ecosystem: {
        id: 1,
        title: 'Scopri il nostro ecosistema',
        productsTabName: 'Per i prodotti',
        solutionsTabName: 'Per le soluzioni',
        products: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'IO',
                shortName: 'IO',
                description: null,
                slug: 'app-io',
                createdAt: '2024-05-24T07:45:13.658Z',
                updatedAt: '2024-05-24T07:58:24.107Z',
                publishedAt: '2024-05-24T07:45:20.231Z',
                locale: 'en',
                logo: {
                  data: {
                    id: 2,
                    attributes: {
                      name: 'minestrone-soup-500x500.jpg',
                      alternativeText: null,
                      caption: null,
                      width: 500,
                      height: 500,
                      formats: {
                        thumbnail: {
                          name: 'thumbnail_minestrone-soup-500x500.jpg',
                          hash: 'thumbnail_minestrone_soup_500x500_582b21c155',
                          ext: '.jpg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 156,
                          height: 156,
                          size: 8.66,
                          url: '/uploads/thumbnail_minestrone_soup_500x500_582b21c155.jpg',
                        },
                      },
                      hash: 'minestrone_soup_500x500_582b21c155',
                      ext: '.jpg',
                      mime: 'image/jpeg',
                      size: 51.82,
                      url: '/uploads/minestrone_soup_500x500_582b21c155.jpg',
                      previewUrl: null,
                      provider: 'local',
                      provider_metadata: null,
                      createdAt: '2024-04-08T16:05:13.531Z',
                      updatedAt: '2024-04-08T16:05:13.531Z',
                    },
                  },
                },
              },
            },
          ],
        },
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
