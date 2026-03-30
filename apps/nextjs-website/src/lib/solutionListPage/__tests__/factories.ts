/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutionListPage } from '@/lib/solutionListPage/__tests__/fixtures';
import { StrapiSolutionListPage } from '../types';

export function minimalDataSolutionListPage(): StrapiSolutionListPage {
  return {
    title: 'Minimal Solutions',
    description: 'Minimal solutions page',
    solutions: [],
    caseHistories: undefined,
    features: undefined,
    seo: undefined,
  };
}

export function solutionListPageWithoutCaseHistories(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    caseHistories: undefined,
  };
}

export function solutionListPageWithoutFeatures(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    features: undefined,
  };
}

export function solutionListPageWithoutSolutions(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    solutions: [],
  };
}

export function solutionListPageWithMissingSolutionSlug(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    solutions: [
      {
        ...strapiSolutionListPage.solutions[0],
        slug: undefined as unknown as string,
        title: 'Solution Without Slug',
      },
      {
        ...strapiSolutionListPage.solutions[0],
        title: 'Valid Solution',
      },
    ],
  };
}

export function solutionListPageWithMissingCaseHistorySlug(): StrapiSolutionListPage {
  return {
    ...strapiSolutionListPage,
    caseHistories: {
      ...strapiSolutionListPage.caseHistories,
      case_histories: [
        {
          ...strapiSolutionListPage.caseHistories?.case_histories[0],
          id: 1,
          slug: undefined as unknown as string,
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
