/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiGuideData } from '@/lib/__tests__/fixtures/guides';
import { StrapiGuides } from '@/lib/guides/strapiTypes';

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
