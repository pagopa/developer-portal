import * as E from 'fp-ts/lib/Either';
import { GuidesCodec } from '@/lib/strapi/codecs/GuidesCodec';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';
import { productJson } from '@/lib/strapi/__tests__/fixtures/product';
import { bannerLinksJson } from '@/lib/strapi/__tests__/fixtures/bannerLinksJson';

const makeStrapiResponseJson = () => ({
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

describe('GuidesCodec', () => {
  it('should decode strapi guides', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = GuidesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
