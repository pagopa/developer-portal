import * as E from 'fp-ts/lib/Either';
import { StrapiTutorialsCodec } from '@/lib/strapi/tutorial';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'ttt',
        slug: 'ttttt',
        content: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'asadasdasdasd',
              },
            ],
          },
        ],
        createdAt: '2024-05-16T08:10:17.203Z',
        updatedAt: '2024-05-20T09:12:13.509Z',
        publishedAt: null,
        locale: 'en',
        image: {
          data: null,
        },
        bannerLinks: [
          {
            id: 1,
            title: 'asd',
            body: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'asdasd',
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            title: null,
            body: null,
          },
        ],
        relatedLinks: {
          id: 3,
          title: 'yghf',
        },
        product: {
          data: {
            id: 1,
            attributes: {
              name: 'firma-con-io',
              description: 'firma-con-io',
              slug: 'firma-con-io',
              createdAt: '2024-05-20T09:12:02.036Z',
              updatedAt: '2024-05-20T09:12:02.036Z',
              publishedAt: null,
              locale: 'en',
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

describe('StrapiTutorialCodec', () => {
  it('should decode strapi tutorials', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiTutorialsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
