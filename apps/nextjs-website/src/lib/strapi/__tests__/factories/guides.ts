/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { strapiGuideData } from '../fixtures/guides';

export function guideListWithItemsWithEmptyProductSlug() {
  return {
    ...strapiGuideData,
    data: strapiGuideData.data.map((guide) => ({
      ...guide,
      product: {
        ...guide.product,
        data: {
          ...guide.product.data,
          slug: '',
        },
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
        data: {
          ...guide.product.data,
          slug: undefined as any,
        },
      },
    })),
  } satisfies StrapiGuides;
}
