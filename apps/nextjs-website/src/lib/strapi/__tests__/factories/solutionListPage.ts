/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutionListPage } from '@/lib/strapi/__tests__/fixtures/solutionListPage';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';

export function minimalDataSolutionListPage() {
  return {
    data: {
      attributes: {
        title: 'Minimal Solutions',
        description: 'Minimal solutions page',
        locale: 'it',
        updatedAt: '2025-01-01T00:00:00.000Z',
        solutions: {
          data: [],
        },
        caseHistories: undefined,
        features: undefined,
        seo: undefined,
      },
    },
  } satisfies StrapiSolutionListPage;
}

export function solutionListPageWithoutCaseHistories() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      attributes: {
        ...strapiSolutionListPage.data.attributes,
        caseHistories: undefined,
      },
    },
  } satisfies StrapiSolutionListPage;
}

export function solutionListPageWithoutFeatures() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      attributes: {
        ...strapiSolutionListPage.data.attributes,
        features: undefined,
      },
    },
  } satisfies StrapiSolutionListPage;
}

export function solutionListPageWithoutSolutions() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      attributes: {
        ...strapiSolutionListPage.data.attributes,
        solutions: {
          data: [],
        },
      },
    },
  } satisfies StrapiSolutionListPage;
}

export function solutionListPageWithMissingSolutionSlug(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      attributes: {
        ...strapiSolutionListPage.data.attributes,
        solutions: {
          data: [
            {
              attributes: {
                ...strapiSolutionListPage.data.attributes.solutions.data[0]
                  .attributes,
                slug: undefined as any,
                title: 'Solution Without Slug',
              },
            },
            {
              attributes: {
                ...strapiSolutionListPage.data.attributes.solutions.data[0]
                  .attributes,
                title: 'Valid Solution',
              },
            },
          ],
        },
      },
    },
  };
}

export function solutionListPageWithMissingCaseHistorySlug(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      attributes: {
        ...strapiSolutionListPage.data.attributes,
        caseHistories: {
          ...strapiSolutionListPage.data.attributes.caseHistories,
          case_histories: {
            data: [
              {
                id: 1,
                attributes: {
                  ...strapiSolutionListPage.data.attributes.caseHistories
                    ?.case_histories.data[0].attributes,
                  slug: undefined as any,
                  title: 'Case History Without Slug',
                },
              },
              {
                id: 2,
                attributes: {
                  ...strapiSolutionListPage.data.attributes.caseHistories
                    ?.case_histories.data[0].attributes,
                  title: 'Valid Case History',
                },
              },
            ],
          },
        },
      },
    },
  };
}
