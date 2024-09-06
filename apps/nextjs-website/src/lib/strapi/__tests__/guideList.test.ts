import * as E from 'fp-ts/lib/Either';
import { guideImageJson } from './guides.test';
import { StrapiGuideListPagesCodec } from '../codecs/GuideListPagesCodec';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
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
                    image: guideImageJson,
                    mobileImage: guideImageJson,
                  },
                },
              ],
            },
          },
        ],
        product: {
          data: {
            id: 1,
            attributes: {
              name: 'CMS APP IO',
              description: 'Test desc ',
              slug: 'app-io',
              createdAt: '2024-02-15T09:57:22.179Z',
              updatedAt: '2024-07-17T15:08:58.315Z',
              publishedAt: '2024-02-15T09:57:24.401Z',
              locale: 'it',
              shortName: 'app-io',
            },
          },
        },
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

describe('StrapiGuideListCodec', () => {
  it('should decode strapi guide list', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiGuideListPagesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
