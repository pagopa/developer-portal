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
