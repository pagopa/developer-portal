/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiGuideData } from '@/lib/guides/__tests__/fixtures';
import type { StrapiGuides } from '@/lib/guides/strapiTypes';

export function guideListWithItemsWithEmptyProductSlug() {
  return {
    ...strapiGuideData,
    data: strapiGuideData.data.map((guide) => ({
      ...guide,
      product: {
        ...guide.product,
        slug: '',
      },
    })),
  } satisfies StrapiGuides;
}

export function guideListWithMissingProductSlug() {
  return {
    ...strapiGuideData,
    data: strapiGuideData.data.map((guide) => ({
      ...guide,
      product: {
        ...guide.product,
        slug: undefined as any,
      },
    })),
  } satisfies StrapiGuides;
}
