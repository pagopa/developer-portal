/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutionListPage } from '@/lib/strapi/__tests__/fixtures/solutionListPage';

export function minimalDataSolutionListPage() {
  return {
    title: 'Minimal Solutions',
    description: 'Minimal solutions page',
    solutions: [],
    caseHistories: undefined,
    features: undefined,
    seo: undefined,
  };
}

export function solutionListPageWithoutCaseHistories() {
  return {
    ...strapiSolutionListPage,
    caseHistories: undefined,
  };
}

export function solutionListPageWithoutFeatures() {
  return {
    ...strapiSolutionListPage,
    features: undefined,
  };
}

export function solutionListPageWithoutSolutions() {
  return {
    ...strapiSolutionListPage,
    solutions: [],
  };
}

export function solutionListPageWithMissingSolutionSlug() {
  return {
    ...strapiSolutionListPage,
    solutions: [
      {
        ...strapiSolutionListPage.solutions[0],
        slug: undefined,
        title: 'Solution Without Slug',
      },
      {
        ...strapiSolutionListPage.solutions[0],
        title: 'Valid Solution',
      },
    ],
  };
}

export function solutionListPageWithMissingCaseHistorySlug() {
  return {
    ...strapiSolutionListPage,
    caseHistories: {
      ...strapiSolutionListPage.caseHistories,
      case_histories: [
        {
          ...strapiSolutionListPage.caseHistories?.case_histories[0],
          id: 1,
          slug: undefined,
          title: 'Case History Without Slug',
        },
        {
          ...strapiSolutionListPage.caseHistories?.case_histories[0],
          id: 2,
          title: 'Valid Case History',
        },
      ],
    },
  };
}
