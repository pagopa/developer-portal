/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiOverview, StrapiOverviews } from '@/lib/strapi/types/overviews';
import { strapiOverviews } from '@/lib/strapi/__tests__/fixtures/overviews';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalDataSingleOverview(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
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
  ]);
}

export function overviewsWithItemWithEmptyProductSlug(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiOverviews.data[0],
      product: {
        ...strapiOverviews.data[0]?.product,
        slug: '',
      },
    } as StrapiOverview,
  ]);
}

export function overviewsWithItemMissingProductSlug(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiOverviews.data[0],
      product: {
        ...strapiOverviews.data[0]?.product,
        slug: undefined as any,
      },
    } as StrapiOverview,
  ]);
}

export function overviewsWithItemMissingTutorialProductSlug(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiOverviews.data[0],
      tutorialSection: {
        ...strapiOverviews.data[0]?.tutorialSection,
        tutorials: [
          {
            ...strapiOverviews.data[0]?.tutorialSection.tutorials[0],
            product: {
              ...strapiOverviews.data[0]?.tutorialSection.tutorials[0].product,
              slug: undefined as any,
            },
          },
        ],
      },
    } as StrapiOverview,
  ]);
}

export function overviewsWithItemMissingTutorialSlug(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiOverviews.data[0],
      tutorialSection: {
        ...strapiOverviews.data[0]?.tutorialSection,
        tutorials: [
          {
            ...strapiOverviews.data[0]?.tutorialSection.tutorials[0],
            slug: undefined as any,
          },
        ],
      },
    } as StrapiOverview,
  ]);
}

export function overviewsWithItemWithEmptyGuideProductSlug(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiOverviews.data[0],
      postIntegration: {
        ...strapiOverviews.data[0]?.postIntegration,
        guides: [
          {
            ...strapiOverviews.data[0]?.postIntegration.guides[0],
            slug: '',
          },
        ],
      },
    } as StrapiOverview,
  ]);
}

export function overviewsWithItemMissingGuideProductSlug(): StrapiOverviews {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiOverviews.data[0],
      postIntegration: {
        ...strapiOverviews.data[0]?.postIntegration,
        guides: [
          {
            ...strapiOverviews.data[0]?.postIntegration.guides[0],
            slug: undefined as any,
          },
        ],
      },
    } as StrapiOverview,
  ]);
}
