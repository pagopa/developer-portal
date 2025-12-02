/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { strapiGuideData } from '../fixtures/guides';

export function guideListWithItemsWithEmptyProductSlug() {
  return {
    ...strapiGuideData,
    ...strapiGuideData.data.map((guide) => ({
      ...guide,
      product: {
        ...guide.product,
        data: {
          ...guide.product,
          slug: '',
        },
      },
    })),
  } satisfies StrapiGuides;
}

export function guideListWithMissingProductSlug() {
  return {
    ...strapiGuideData,
    ...strapiGuideData.data.map((guide) => ({
      ...guide,
      product: {
        ...guide.product,
        data: {
          ...guide.product,
          slug: undefined as any,
        },
      },
    })),
  } satisfies StrapiGuides;
}
