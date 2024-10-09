import * as E from 'fp-ts/lib/Either';
import { GuideListPagesCodec } from '../codecs/GuideListPagesCodec';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';
import { productJson } from '@/lib/strapi/__tests__/fixtures/product';
import { bannerLinksJson } from '@/lib/strapi/__tests__/fixtures/bannerLinksJson';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        seo: null,
        title: 'guides',
        description: 'dfd sdcf dfsd fsdf sdf sdfsd',
        createdAt: '2024-08-19T14:10:10.483Z',
        updatedAt: '2024-08-19T14:10:13.679Z',
        publishedAt: '2024-08-19T14:10:13.676Z',
        locale: 'it',
        guidesByCategory: [
          {
            id: 1,
            category: 'cat 1',
            guides: {
              data: [
                {
                  id: 1,
                  attributes: {
                    seo: null,
                    title: 'test',
                    slug: 'guide-1',
                    createdAt: '2024-08-19T13:40:06.503Z',
                    updatedAt: '2024-08-19T13:40:14.256Z',
                    publishedAt: '2024-08-19T13:40:14.253Z',
                    locale: 'it',
                    versions: [
                      {
                        id: 3,
                        main: true,
                        dirname: 'aBQM7h48Vhhg8le4VIK8',
                        version: 'v5.1',
                      },
                    ],
                    listItems: [
                      {
                        id: 6,
                        text: 'fdsfgd fsdfsd fsdf sdfsd',
                      },
                    ],
                    image: mediaRasterJson,
                    mobileImage: mediaRasterJson,
                  },
                },
              ],
            },
          },
        ],
        bannerLinks: bannerLinksJson,
        product: productJson,
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

describe('GuideListPagesCodec', () => {
  it('should decode strapi guide list pages', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = GuideListPagesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
