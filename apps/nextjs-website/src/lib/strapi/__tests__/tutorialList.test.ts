import * as E from 'fp-ts/lib/Either';
import { TutorialListPagesCodec } from '../codecs/TutorialListPagesCodec';
import { mediaVectorJson } from './fixtures/media';
import { baseProductJson, productJson } from './fixtures/product';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'Tutorial',
        description:
          'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
        createdAt: '2024-09-03T13:18:04.746Z',
        updatedAt: '2024-09-03T13:18:05.528Z',
        publishedAt: '2024-09-03T13:18:05.524Z',
        locale: 'it',
        tutorials: {
          data: [
            {
              id: 3,
              attributes: {
                title: 'title',
                slug: 'tut-1',
                createdAt: '2024-06-04T12:34:13.309Z',
                updatedAt: '2024-08-06T10:15:09.118Z',
                publishedAt: '2024-08-06T10:15:09.114Z',
                locale: 'it',
                image: mediaVectorJson,
                product: baseProductJson,
              },
            },
          ],
        },
        product: productJson,
        bannerLinks: [
          {
            id: 22,
            title: 'test',
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'sfddsfd fds fsd fsd',
                  },
                ],
              },
            ],
            theme: 'light',
            subtitle: 'fdfd d',
            icon: mediaVectorJson,
          },
          {
            id: 23,
            title: 'test 2',
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'fsdfdsdf dsf sd',
                  },
                ],
              },
            ],
            theme: 'light',
            subtitle: 'fdfdfd',
            icon: mediaVectorJson,
          },
        ],
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

describe('TutorialListPagesCodec', () => {
  it('should decode strapi tutorial list pages', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = TutorialListPagesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
