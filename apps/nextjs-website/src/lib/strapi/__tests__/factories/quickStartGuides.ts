/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiQuickStartGuides } from '@/lib/strapi/types/quickStartGuides';
import { minimalAlertPart } from './parts';
import { strapiQuickStartGuides } from '../fixtures/quickStartGuides';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalQuickStartGuides(): StrapiQuickStartGuides {
  return wrapAsPaginatedRootEntity([
    {
      id: 1,
      title: 'Minimal Quick Start',
      description: '',
      updatedAt: '2024-01-01T00:00:00.000Z',
      product: strapiQuickStartGuides.data[0].product,
      bannerLinks: [],
      seo: undefined,
      quickstartGuideItems: [
        {
          id: 1,
          title: 'Minimal Step',
          anchor: 'minimal-step',
          publishedAt: '2024-01-01T00:00:00.000Z',
          parts: [minimalAlertPart()],
        },
      ],
    },
  ]) as StrapiQuickStartGuides;
}

export function emptyQuickStartGuides(): StrapiQuickStartGuides {
  return wrapAsPaginatedRootEntity([]) as StrapiQuickStartGuides;
}

export function quickStartGuidesWithMissingProductSlug(): StrapiQuickStartGuides {
  return wrapAsPaginatedRootEntity(
    strapiQuickStartGuides.data.map((quickStart, index) => {
      if (index === 0) {
        return {
          ...quickStart,
          product: {
            ...quickStart.product!,
            slug: undefined as any,
          },
        };
      }
      return quickStart;
    })
  ) as StrapiQuickStartGuides;
}
