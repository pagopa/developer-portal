/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overview, Overviews } from '@/lib/overviews/types';
import { strapiOverviews } from '@/lib/shared/fixtures/overviews';

export function minimalDataSingleOverview(): Overviews {
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
      } as Overview,
    ],
  };
}

export function overviewsWithItemWithEmptyProductSlug(): Overviews {
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

export function overviewsWithItemMissingProductSlug(): Overviews {
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

export function overviewsWithItemMissingTutorialProductSlug(): Overviews {
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

export function overviewsWithItemMissingTutorialSlug(): Overviews {
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

export function overviewsWithItemWithEmptyGuideProductSlug(): Overviews {
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

export function overviewsWithItemMissingGuideProductSlug(): Overviews {
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
