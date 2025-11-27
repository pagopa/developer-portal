import { strapiGuideListPagesData } from '@/lib/strapi/__tests__/fixtures/guideListPages';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';

export function guideListPagesWithItemsMissingSlug() {
  return strapiGuideListPagesData.map((guides) => ({
    ...guides,
    guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
      ...guidePerCategory,
      guides: guidePerCategory.guides.map((guide) => ({
        ...guide,
        slug: undefined,
      })),
    })),
  }));
}

export function guideListPagesWithItemsMissingImages() {
  return strapiGuideListPagesData.map((guides) => ({
    ...guides,
    guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
      ...guidePerCategory,
      guides: guidePerCategory.guides.map(() => ({
        image: undefined,
        mobileImage: undefined,
      })),
    })),
  }));
}

export function guideListPagesWithItemsMissingListItem() {
  return strapiGuideListPagesData.map((guides) => ({
    ...guides,
    guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
      ...guidePerCategory,
      guides: [
        {
          listItems: undefined,
        },
        ...guidePerCategory.guides.slice(1),
      ],
    })),
  }));
}

export function guideListPagesWithItemsWithWrongDataType() {
  return strapiGuideListPagesData.map((guides) => ({
    ...guides,
    title: 12345, // Wrong data type: it should be a string
    description: 67890, // Wrong data type: it should be a string
  }));
}

export function guideListPagesWithItemMissingProductSlug() {
  return strapiGuideListPagesData.map((guides) => ({
    ...guides,
    product: {
      ...guides.product,
      slug: undefined,
    },
  })) as unknown as StrapiGuideListPages;
}
