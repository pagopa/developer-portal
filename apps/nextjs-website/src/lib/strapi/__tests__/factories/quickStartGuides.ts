/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiQuickStartGuides } from '@/lib/strapi/types/quickStartGuides';
import { minimalAlertPart } from './parts';
import { strapiQuickStartGuides } from '../fixtures/quickStartGuides';

export function minimalQuickStartGuides(): StrapiQuickStartGuides {
  return {
    data: [
      {
        id: 1,
        attributes: {
          title: 'Minimal Quick Start',
          description: '',
          updatedAt: '2024-01-01T00:00:00.000Z',
          locale: 'it',
          product: strapiQuickStartGuides.data[0].attributes.product,
          bannerLinks: [],
          seo: undefined,
          quickstartGuideItems: {
            data: [
              {
                id: 1,
                attributes: {
                  title: 'Minimal Step',
                  anchor: 'minimal-step',
                  publishedAt: '2024-01-01T00:00:00.000Z',
                  parts: [minimalAlertPart()],
                },
              },
            ],
          },
        },
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
    ...strapiQuickStartGuides,
    data: strapiQuickStartGuides.data.map((quickStart, index) => {
      if (index === 0) {
        return {
          ...quickStart,
          attributes: {
            ...quickStart.attributes,
            product: {
              ...quickStart.attributes.product,
              data: {
                ...quickStart.attributes.product.data,
                attributes: {
                  ...(quickStart.attributes.product.data?.attributes as any),
                  slug: undefined as any,
                },
              },
            },
          },
        };
      }
      return quickStart;
    }),
  };
}
