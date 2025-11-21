import { strapiGuideListPagesData } from '@/lib/strapi/__tests__/fixtures/guideListPages';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';

export function guideListPagesWithItemsMissingSlug() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
        ...guidePerCategory,
        guides: {
          data: guidePerCategory.guides.data.map((guide) => ({
            ...guide,
            slug: undefined,
          })),
        },
      })),
    })),
  };
}

export function guideListPagesWithItemsMissingImages() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
        ...guidePerCategory,
        guides: {
          data: guidePerCategory.guides.data.map(() => ({
            image: undefined,
            mobileImage: undefined,
          })),
        },
      })),
    })),
  };
}

export function guideListPagesWithItemsMissingListItem() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
        ...guidePerCategory,
        guides: {
          data: [
            {
              listItems: undefined,
            },
            ...guidePerCategory.guides.data.slice(1),
          ],
        },
      })),
    })),
  };
}

export function guideListPagesWithItemsWithWrongDataType() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      title: 12345, // Wrong data type: it should be a string
      description: 67890, // Wrong data type: it should be a string
    })),
  };
}

export function guideListPagesWithItemMissingProductSlug() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      product: {
        data: {
          ...guides.product.data,
          slug: undefined,
        },
      },
    })),
  } as unknown as StrapiGuideListPages;
}
