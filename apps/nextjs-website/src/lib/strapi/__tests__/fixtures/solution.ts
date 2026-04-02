import { mediaVectorJson } from '@/lib/strapi/__tests__/fixtures/media';
import { productsJson } from '@/lib/strapi/__tests__/fixtures/product';

export const baseSolutionJson = {
  id: 1,
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
  statsSource: null,
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
          seo: null,
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
          products: productsJson,
        },
      ],
    },
  },
  seo: null,
};
