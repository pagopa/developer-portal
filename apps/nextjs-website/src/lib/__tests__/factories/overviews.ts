/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiOverview, StrapiOverviews } from '@/lib/overviews/types';
import { strapiOverviews } from '@/lib/__tests__/fixtures/overviews';

export function minimalDataSingleOverview(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        features: undefined,
        startInfoSection: undefined,
        tutorialSection: undefined,
        whatsNew: undefined,
        postIntegration: undefined,
        relatedLinks: undefined,
        seo: undefined,
      } as StrapiOverview,
    ],
  };
}

export function overviewsWithItemWithEmptyProductSlug(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        product: {
          ...strapiOverviews.data[0]?.product,
          slug: '',
        },
      },
    ],
  };
}

export function overviewsWithItemMissingProductSlug(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        product: {
          ...strapiOverviews.data[0]?.product,
          slug: undefined as any,
        },
      },
    ],
  };
}

export function overviewsWithItemMissingTutorialProductSlug(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        tutorialSection: {
          ...strapiOverviews.data[0]?.tutorialSection,
          tutorials: [
            {
              ...strapiOverviews.data[0]?.tutorialSection?.tutorials[0],
              product: {
                ...strapiOverviews.data[0]?.tutorialSection?.tutorials[0]
                  ?.product,
                slug: undefined as any,
              },
            },
          ],
        },
      },
    ],
  };
}

export function overviewsWithItemMissingTutorialSlug(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        tutorialSection: {
          ...strapiOverviews.data[0]?.tutorialSection,
          tutorials: [
            {
              ...strapiOverviews.data[0]?.tutorialSection?.tutorials[0],
              slug: undefined as any,
            },
          ],
        },
      },
    ],
  };
}

export function overviewsWithItemWithEmptyGuideProductSlug(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        postIntegration: {
          ...strapiOverviews.data[0]?.postIntegration,
          guides: [
            {
              ...strapiOverviews.data[0]?.postIntegration?.guides[0],
              slug: '',
            },
          ],
        },
      },
    ],
  };
}

export function overviewsWithItemMissingGuideProductSlug(): StrapiOverviews {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.data[0],
        postIntegration: {
          ...strapiOverviews.data[0]?.postIntegration,
          guides: [
            {
              ...strapiOverviews.data[0]?.postIntegration?.guides[0],
              slug: undefined as any,
            },
          ],
        },
      },
    ],
  };
}
