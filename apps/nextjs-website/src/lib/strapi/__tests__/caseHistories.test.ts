import * as E from 'fp-ts/lib/Either';
import { CaseHistoriesCodec } from '../codecs/CaseHistoriesCodec';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';
import { productJson } from '@/lib/strapi/__tests__/fixtures/product';

export const baseCaseHistoryJson = {
  id: 1,
  attributes: {
    slug: 'case-history-1',
    title: 'Case History',
    description: null,
    createdAt: '2024-06-05T13:04:34.614Z',
    updatedAt: '2024-06-05T13:11:07.933Z',
    publishedAt: '2024-06-05T13:08:21.443Z',
    locale: 'it',
    products: {
      data: [],
    },
    image: {
      data: null,
    },
    parts: [],
    seo: null,
  },
};

const makeStrapiResponseJson = () => ({
  data: [
    {
      ...baseCaseHistoryJson,
      products: {
        data: [productJson, productJson],
      },
      image: mediaRasterJson,
      parts: [
        {
          id: 1,
          __component: 'parts.alert',
          text: 'test',
          title: 'test',
          severity: 'warning',
        },
        {
          id: 1,
          __component: 'parts.api-tester',
          requestDescription: 'test',
          responseDescription: 'res',
          responseCode: {
            id: 3,
            code: 'code res',
            showLineNumbers: true,
            language: null,
          },
          requestCode: {
            id: 2,
            code: 'code',
            showLineNumbers: false,
            language: 'xml',
          },
          requestAttributes: [
            {
              id: 1,
              label: 'att',
              value: '1',
            },
          ],
        },
        {
          id: 1,
          __component: 'parts.code-block',
          code: 'code block',
          showLineNumbers: true,
          language: 'shell',
        },
        {
          id: 1,
          __component: 'parts.embed-html',
          html: '<div>test <u>test</u></div>',
        },
        {
          id: 1,
          __component: 'parts.html',
          html: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'fsdfdsf sfsdf sdf sdf sd',
                },
              ],
            },
          ],
        },
        {
          id: 1,
          __component: 'parts.quote',
          text: 'quote',
          backgroundImage: mediaRasterJson,
        },
      ],
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

const makeStrapiResponseJsonWithNull = () => ({
  data: [baseCaseHistoryJson],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
});

describe('CaseHistoriesCodec', () => {
  it('should decode strapi case histories', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = CaseHistoriesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi case histories with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseJsonWithNull();
    const actual = CaseHistoriesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
