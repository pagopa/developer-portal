/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutions } from '@/lib/strapi/__tests__/fixtures/solutions';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';

export function minimalDataSolutions() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
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
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemMissingData() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        title: undefined,
        slug: undefined,
        description: undefined,
      },
    ],
  };
}

export function solutionWithItemMissingMandatoryData() {
  const strapiSolution = solutionsWithItemMissingData().data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        icon: undefined,
      },
    ],
  };
}

export function solutionsWithItemWithoutCaseHistories() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        caseHistories: undefined,
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemWithoutWebinars() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        webinars: [],
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemMissingSolutionSlug() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        title: 'Solution Without Slug',
        slug: undefined as any,
      },
      {
        ...strapiSolution,
        title: 'Valid Solution',
        slug: 'valid-solution',
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemMissingCaseHistorySlug(): StrapiSolutions {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        title: 'Solution with Case History Missing Slug',
        slug: 'solution-with-case-history-missing-slug',
        caseHistories: {
          title: 'Success Stories',
          description: 'Our success stories',
          case_histories: [
            {
              ...strapiSolution?.caseHistories?.case_histories[0],
              id: 1,
              title: 'Case History Without Slug',
              slug: undefined as any,
              image: {
                ...strapiSolution?.caseHistories?.case_histories[0].image,
                url: '/test-image.png',
                name: 'Test Image',
              },
            },
            {
              ...strapiSolution?.caseHistories?.case_histories[0],
              id: 2,
              title: 'Valid Case History',
              slug: 'valid-case-history',
              image: {
                ...strapiSolution?.caseHistories?.case_histories[0].image,
                url: '/valid-image.png',
                name: 'Valid Image',
              },
            },
          ],
        },
      },
    ],
  } satisfies StrapiSolutions;
}
