/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutionListPage } from '@/lib/solutionListPage/__tests__/fixtures';
import type { StrapiSolutionListPage } from '../types';
import { wrapAsRootEntity } from '../../__tests__/strapiEntityWrappers';

export function minimalDataSolutionListPage(): StrapiSolutionListPage {
  return wrapAsRootEntity({
    title: 'Minimal Solutions',
    description: 'Minimal solutions page',
    solutions: [],
    caseHistories: undefined,
    features: undefined,
    seo: undefined,
  });
}

export function solutionListPageWithoutCaseHistories(): StrapiSolutionListPage {
  return wrapAsRootEntity({
    ...strapiSolutionListPage.data,
    caseHistories: undefined,
  });
}

export function solutionListPageWithoutFeatures(): StrapiSolutionListPage {
  return wrapAsRootEntity({
    ...strapiSolutionListPage.data,
    features: undefined,
  });
}

export function solutionListPageWithoutSolutions(): StrapiSolutionListPage {
  return wrapAsRootEntity({
    ...strapiSolutionListPage.data,
    solutions: [],
  });
}

export function solutionListPageWithMissingSolutionSlug(): StrapiSolutionListPage {
  return wrapAsRootEntity({
    ...strapiSolutionListPage.data,
    solutions: [
      {
        ...strapiSolutionListPage.data.solutions[0],
        slug: undefined as unknown as string,
        title: 'Solution Without Slug',
      },
      {
        ...strapiSolutionListPage.data.solutions[0],
        title: 'Valid Solution',
      },
    ],
  });
}

export function solutionListPageWithMissingCaseHistorySlug(): StrapiSolutionListPage {
  return wrapAsRootEntity({
    ...strapiSolutionListPage.data,
    caseHistories: {
      ...strapiSolutionListPage.data.caseHistories,
      case_histories: [
        {
          ...strapiSolutionListPage.data.caseHistories?.case_histories[0],
          id: 1,
          slug: undefined as unknown as string,
          title: 'Case History Without Slug',
        },
        {
          ...strapiSolutionListPage.data.caseHistories?.case_histories[0],
          id: 2,
          title: 'Valid Case History',
        },
      ],
    },
  });
}
