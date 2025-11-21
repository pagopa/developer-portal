/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiSolutions } from '@/lib/strapi/__tests__/fixtures/solutions';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';

export function minimalDataSolutions() {
  const strapiSolution = strapiSolutions.at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution!,
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
  const strapiSolution = strapiSolutions.at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution!,
        title: undefined,
        slug: undefined,
        description: undefined,
      },
    ],
  };
}

export function solutionWithItemMissingMandatoryData() {
  const strapiSolution = solutionsWithItemMissingData().at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution,
        icon: undefined,
      },
    ],
  };
}

export function solutionsWithItemWithoutCaseHistories() {
  const strapiSolution = strapiSolutions.at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution!,
        caseHistories: undefined,
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemWithoutWebinars() {
  const strapiSolution = strapiSolutions.at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution!,
        webinars: [],
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemMissingSolutionSlug() {
  const strapiSolution = strapiSolutions.at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution!,
        title: 'Solution Without Slug',
        slug: undefined as any,
      },
      {
        ...strapiSolution!,
        title: 'Valid Solution',
        slug: 'valid-solution',
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithItemMissingCaseHistorySlug(): StrapiSolutions {
  const strapiSolution = strapiSolutions.at(0);
  return {
    ...strapiSolutions,
    ...[
      {
        ...strapiSolution!,
        title: 'Solution with Case History Missing Slug',
        slug: 'solution-with-case-history-missing-slug',
        caseHistories: {
          title: 'Success Stories',
          description: 'Our success stories',
          case_histories: {
            ...strapiSolution!.caseHistories,
            ...[
              {
                ...strapiSolution!.caseHistories!.case_histories[0],
                id: 1,
                title: 'Case History Without Slug',
                slug: undefined as any,
                image: {
                  ...strapiSolution!.caseHistories!.case_histories[0].image,
                  url: '/test-image.png',
                  name: 'Test Image',
                },
              },
              {
                ...strapiSolution!.caseHistories!.case_histories[0],
                id: 2,
                title: 'Valid Case History',
                slug: 'valid-case-history',
                image: {
                  ...strapiSolution!.caseHistories!.case_histories[0].image,
                  url: '/valid-image.png',
                  name: 'Valid Image',
                },
              },
            ],
          },
        },
      },
    ],
  } satisfies StrapiSolutions;
}
