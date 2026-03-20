/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { strapiGuideData } from '@/lib/shared/fixtures/guides';

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
