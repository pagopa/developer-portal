/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrapiGuides } from '@/lib/strapi/types/guide';
import { strapiGuideData } from '../fixtures/guides';

export function guideListWithItemsWithEmptyProductSlug() {
  return {
    ...strapiGuideData,
    data: strapiGuideData.data.map((guide) => ({
      ...guide,
      attributes: {
        ...guide.attributes,
        product: {
          ...guide.attributes.product,
          data: {
            ...guide.attributes.product.data,
            attributes: {
              ...guide.attributes.product.data.attributes,
              slug: '',
            },
          },
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
      attributes: {
        ...guide.attributes,
        product: {
          ...guide.attributes.product,
          data: {
            ...guide.attributes.product.data,
            attributes: {
              ...guide.attributes.product.data.attributes,
              slug: undefined as any,
            },
          },
        },
      },
    })),
  } satisfies StrapiGuides;
}
