/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiQuickStartGuides } from '@/lib/strapi/types/quickStartGuides';
import { minimalAlertPart } from './parts';
import { strapiQuickStartGuides } from '../fixtures/quickStartGuides';

export function minimalQuickStartGuides(): StrapiQuickStartGuides {
  return {
    data: [
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
    ],
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: 1,
      },
    },
  };
}

export function emptyQuickStartGuides(): StrapiQuickStartGuides {
  return {
    data: [],
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 0,
        total: 0,
      },
    },
  };
}

export function quickStartGuidesWithMissingProductSlug(): StrapiQuickStartGuides {
  return {
    meta: strapiQuickStartGuides.meta,
    data: strapiQuickStartGuides.data.map((quickStart, index) => {
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
    }),
  };
}
