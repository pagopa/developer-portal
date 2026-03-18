import { strapiGuideListPagesData } from '@/lib/strapi/__tests__/fixtures/guideListPages';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function guideListPagesWithItemsMissingSlug(): StrapiGuideListPages {
  return wrapAsPaginatedRootEntity(
    strapiGuideListPagesData.data.map((guides) => ({
      ...guides,
      guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
        ...guidePerCategory,
        guides: guidePerCategory.guides.map((guide) => ({
          ...guide,
          slug: undefined as any,
        })),
      })),
    }))
  );
}

export function guideListPagesWithItemsMissingImages(): StrapiGuideListPages {
  return wrapAsPaginatedRootEntity(
    strapiGuideListPagesData.data.map((guides) => ({
      ...guides,
      guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
        ...guidePerCategory,
        guides: guidePerCategory.guides.map((guide) => ({
          ...guide,
          image: undefined as any,
          mobileImage: undefined as any,
        })),
      })),
    }))
  );
}

export function guideListPagesWithItemsMissingListItem(): StrapiGuideListPages {
  return wrapAsPaginatedRootEntity(
    strapiGuideListPagesData.data.map((guides) => ({
      ...guides,
      guidesByCategory: guides.guidesByCategory.map((guidePerCategory) => ({
        ...guidePerCategory,
        guides: [
          guidePerCategory.guides[0],
          {
            ...guidePerCategory.guides[1],
            listItems: undefined as any,
          },
        ],
      })),
    }))
  );
}

export function guideListPagesWithItemsWithWrongDataType(): StrapiGuideListPages {
  return wrapAsPaginatedRootEntity(
    strapiGuideListPagesData.data.map((guides) => ({
      ...guides,
      title: 12345 as any, // Wrong data type: it should be a string
      description: 67890 as any, // Wrong data type: it should be a string
    }))
  );
}

export function guideListPagesWithItemMissingProductSlug(): StrapiGuideListPages {
  return wrapAsPaginatedRootEntity(
    strapiGuideListPagesData.data.map((guides) => ({
      ...guides,
      product: {
        ...guides.product,
        slug: undefined as any,
      },
    }))
  );
}
