/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiOverview, StrapiOverviews } from '@/lib/strapi/types/overviews';
import { strapiOverviews } from '@/lib/strapi/__tests__/fixtures/overviews';

export function minimalDataSingleOverview(): StrapiOverviews {
  return {
    ...strapiOverviews,
    ...[
      {
        ...strapiOverviews.at(0),
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

export function overviewsWithItemWithEmptyProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.at(0),
        product: {
          ...strapiOverviews.at(0)?.product,
          slug: '',
        },
      },
    ],
  };
}

export function overviewsWithItemMissingProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.at(0),
        product: {
          ...strapiOverviews.at(0)?.product,
          slug: undefined as any,
        },
      },
    ],
  };
}

export function overviewsWithItemMissingTutorialProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.at(0),
        tutorialSection: {
          ...strapiOverviews.at(0)?.tutorialSection,
          tutorials: [
            {
              ...strapiOverviews.at(0)?.tutorialSection.tutorials[0],
              product: {
                data: {
                  ...strapiOverviews.at(0)?.tutorialSection.tutorials[0]
                    .product,
                  slug: undefined as any,
                },
              },
            },
          ],
        },
      },
    ],
  };
}

export function overviewsWithItemMissingTutorialSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.at(0),
        tutorialSection: {
          ...strapiOverviews.at(0)?.tutorialSection,
          tutorials: [
            {
              ...strapiOverviews.at(0)?.tutorialSection.tutorials[0],
              slug: undefined as any,
            },
          ],
        },
      },
    ],
  };
}

export function overviewsWithItemWithEmptyGuideProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.at(0),
        postIntegration: {
          ...strapiOverviews.at(0)?.postIntegration,
          guides: [
            {
              ...strapiOverviews.at(0)?.postIntegration.guides[0],
              slug: '',
            },
          ],
        },
      },
    ],
  };
}

export function overviewsWithItemMissingGuideProductSlug() {
  return {
    ...strapiOverviews,
    data: [
      {
        ...strapiOverviews.at(0),
        postIntegration: {
          ...strapiOverviews.at(0)?.postIntegration,
          guides: [
            {
              ...strapiOverviews.at(0)?.postIntegration.guides[0],
              slug: undefined as any,
            },
          ],
        },
      },
    ],
  };
}
