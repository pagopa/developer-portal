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
            target: null,
          },
        ],
      },
      hero: [
        {
          id: 1,
          variant: 'aText',
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
              ],
            },
          ],
          backgroundImage: {
            data: [
              {
                id: 2,
                attributes: {
                  name: 'aText',
                  alternativeText: null,
                  caption: null,
                  width: 1440,
                  height: 495,
                  formats: {
                    thumbnail: {
                      name: 'aText',
                      hash: 'aText',
                      ext: '.aText',
                      mime: 'aText',
                      path: null,
                      width: 245,
                      height: 84,
                      size: 9.34,
                      url: 'aText',
                    },
                  },
                  hash: 'atext',
                  ext: 'atext',
                  mime: 'atext',
                  size: 49.52,
                  url: 'atext',
                  previewUrl: null,
                  provider: 'atext',
                  provider_metadata: null,
                  createdAt: '2024-02-15T15:50:04.876Z',
                  updatedAt: '2024-02-16T15:38:03.748Z',
                },
              },
            ],
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
});
