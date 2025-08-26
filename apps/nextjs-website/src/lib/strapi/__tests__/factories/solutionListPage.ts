import { strapiSolutionListPage } from '@/lib/strapi/__tests__/fixtures/solutionListPage';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';

export function minimalDataSolutionListPage() {
  return {
    data: {
      attributes: {
        title: 'Minimal Solutions',
        description: 'Minimal solutions page',
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
