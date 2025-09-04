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

export function solutionsWithMissingSolutionSlug() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          title: 'Solution Without Slug',
          slug: undefined as any,
        },
      },
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          title: 'Valid Solution',
          slug: 'valid-solution',
        },
      },
    ],
  } satisfies StrapiSolutions;
}

export function solutionsWithMissingCaseHistorySlug() {
  const strapiSolution = strapiSolutions.data[0];
  return {
    ...strapiSolutions,
    data: [
      {
        ...strapiSolution,
        attributes: {
          ...strapiSolution.attributes,
          title: 'Solution with Case History Missing Slug',
          slug: 'solution-with-case-history-missing-slug',
          caseHistories: {
            title: 'Success Stories',
            description: 'Our success stories',
            case_histories: {
              data: [
                {
                  id: 1,
                  attributes: {
                    ...strapiSolution.attributes.caseHistories?.case_histories
                      .data[0].attributes,
                    title: 'Case History Without Slug',
                    slug: undefined as any,
                    image: {
                      data: {
                        attributes: {
                          ...strapiSolution.attributes.caseHistories
                            ?.case_histories.data[0].attributes.image.data
                            .attributes,
                          url: '/test-image.png',
                          name: 'Test Image',
                        },
                      },
                    },
                  },
                },
                {
                  id: 2,
                  attributes: {
                    ...strapiSolution.attributes.caseHistories?.case_histories
                      .data[0].attributes,
                    title: 'Valid Case History',
                    slug: 'valid-case-history',
                    image: {
                      data: {
                        attributes: {
                          ...strapiSolution.attributes.caseHistories
                            ?.case_histories.data[0].attributes.image.data
                            .attributes,
                          url: '/valid-image.png',
                          name: 'Valid Image',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  } satisfies StrapiSolutions;
}
