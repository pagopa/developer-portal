import { mediaVectorJson } from '@/lib/strapi/__tests__/fixtures/media';

export const baseSolutionJson = {
  id: 1,
  attributes: {
    slug: 'solution-1',
    kickerTitle: 'kickerTitle',
    title: 'Title Test',
    description: null,
    dirName: 'lAIZmjrusC6qV8ki9zsZ',
    landingUseCaseFile: 'README.md',
    createdAt: '2024-06-06T15:36:07.300Z',
    updatedAt: '2024-06-06T15:56:26.077Z',
    publishedAt: '2024-06-06T15:36:10.333Z',
    locale: 'it',
    icon: mediaVectorJson,
    introductionToSteps: null,
    steps: [],
    stats: [],
    bannerLinks: [],
    products: {
      data: [],
    },
    webinars: {
      data: [],
    },
    caseHistories: {
      id: 12,
      title: 'Storie di successo',
      description: null,
      case_histories: {
        data: [
          {
            id: 3,
            attributes: {
              slug: 'slugdellacasehistory',
              title: 'Lorem ipsum dolor sit amet consectetur adipiscing el',
              description: 'Lorem ipsum dolor sit amet consectetur adipiscing',
              createdAt: '2024-06-12T13:24:05.128Z',
              updatedAt: '2024-07-02T13:12:21.780Z',
              publishedAt: '2024-06-12T13:24:27.231Z',
              locale: 'it',
              image: {
                data: null,
              },
              parts: [],
              products: {
                data: [
                  {
                    id: 2,
                    attributes: {
                      name: 'Firma con IO',
                      description: 'Lorem ipsum dolor sit amet',
                      slug: 'firma-con-io',
                      createdAt: '2024-02-16T10:14:15.098Z',
                      updatedAt: '2024-07-15T13:23:09.737Z',
                      publishedAt: '2024-02-16T10:14:16.646Z',
                      locale: 'it',
                      shortName: 'Firma con IO',
                      logo: mediaVectorJson,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};
