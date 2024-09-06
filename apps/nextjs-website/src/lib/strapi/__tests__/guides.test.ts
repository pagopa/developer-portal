import * as E from 'fp-ts/lib/Either';
import { GuidesCodec } from '@/lib/strapi/codecs/GuidesCodec';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';

const makeStrapiResponseJson = () => ({
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
            dirName: 'aBQM7h48Vhhg8le4VIK8',
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
        product: {
          data: {
            id: 1,
            attributes: {
              name: 'CMS APP IO',
              description: 'Test desc ',
              slug: 'app-io',
              publishedAt: '2024-02-15T09:57:24.401Z',
              createdAt: '2024-02-15T09:57:22.179Z',
              updatedAt: '2024-07-17T15:08:58.315Z',
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

describe('GuidesCodec', () => {
  it('should decode strapi guides', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = GuidesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
