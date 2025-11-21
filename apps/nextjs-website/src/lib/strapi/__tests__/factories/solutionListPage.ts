/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutionListPage } from '@/lib/strapi/__tests__/fixtures/solutionListPage';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';

export function minimalDataSolutionListPage() {
  return {
    data: {
      title: 'Minimal Solutions',
      description: 'Minimal solutions page',
      solutions: {
        data: [],
      },
      caseHistories: undefined,
      features: undefined,
      seo: undefined,
    },
  };
}

export function solutionListPageWithoutCaseHistories() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      caseHistories: undefined,
    },
  };
}

export function solutionListPageWithoutFeatures() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      features: undefined,
    },
  };
}

export function solutionListPageWithoutSolutions() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      solutions: {
        data: [],
      },
    },
  };
}

export function solutionListPageWithMissingSolutionSlug() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      solutions: {
        data: [
          {
            ...strapiSolutionListPage.data.solutions.data[0],
            slug: undefined,
            title: 'Solution Without Slug',
          },
          {
            ...strapiSolutionListPage.data.solutions.data[0],
            title: 'Valid Solution',
          },
        ],
      },
    },
  };
}

export function solutionListPageWithMissingCaseHistorySlug() {
  return {
    ...strapiSolutionListPage,
    data: {
      ...strapiSolutionListPage.data,
      caseHistories: {
        ...strapiSolutionListPage.data.caseHistories,
        case_histories: {
          data: [
            {
              ...strapiSolutionListPage.data.caseHistories?.case_histories
                .data[0],
              id: 1,
              slug: undefined,
              title: 'Case History Without Slug',
            },
            {
              ...strapiSolutionListPage.data.caseHistories?.case_histories
                .data[0],
              id: 2,
              title: 'Valid Case History',
            },
          ],
        },
      },
    },
  };
}
