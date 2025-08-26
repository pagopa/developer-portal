import { strapiSolutions } from '@/lib/strapi/__tests__/fixtures/solutions';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';

export function minimalDataSolutions() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          title: 'Minimal Data Solution',
          slug: 'minimal-data-solution',
          description: undefined,
          introductionToSteps: undefined,
          steps: [],
          stats: [],
          statsSource: undefined,
          caseHistories: undefined,
          seo: undefined,
        },
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithMissingData() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          title: undefined,
          slug: undefined,
          description: undefined,
        },
      },
    ],
  };
}

export function solutionWithMissingMandatoryData() {
  const strapiSolution = solutionsWithMissingData().data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          icon: { data: undefined },
        },
      },
    ],
  };
}

export function solutionsWithoutCaseHistories() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          caseHistories: undefined,
        },
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithoutWebinars() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          webinars: {
            data: [],
          },
        },
      },
    ],
  } satisfies StrapiSolutions;
}
