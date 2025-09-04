import { strapiGuideListPagesData } from '@/lib/strapi/__tests__/fixtures/guideListPages';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';

export function guideListWithMissingSlugs() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      attributes: {
        ...guides.attributes,
        guidesByCategory: guides.attributes.guidesByCategory.map(
          (guidePerCategory) => ({
            ...guidePerCategory,
            guides: {
              data: guidePerCategory.guides.data.map((guide) => ({
                attributes: {
                  ...guide.attributes,
                  slug: undefined,
                },
              })),
            },
          })
        ),
      },
    })),
  };
}

export function guideListWithMissingImages() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      attributes: {
        ...guides.attributes,
        guidesByCategory: guides.attributes.guidesByCategory.map(
          (guidePerCategory) => ({
            ...guidePerCategory,
            guides: {
              data: guidePerCategory.guides.data.map((guide) => ({
                attributes: {
                  ...guide.attributes,
                  image: undefined,
                  mobileImage: undefined,
                },
              })),
            },
          })
        ),
      },
    })),
  };
}

export function guideListWithGuideWithUndefinedListItem() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      attributes: {
        ...guides.attributes,
        guidesByCategory: guides.attributes.guidesByCategory.map(
          (guidePerCategory) => ({
            ...guidePerCategory,
            guides: {
              data: [
                {
                  attributes: {
                    ...guidePerCategory.guides.data[0].attributes,
                    listItems: undefined,
                  },
                },
                ...guidePerCategory.guides.data.slice(1),
              ],
            },
          })
        ),
      },
    })),
  };
}

export function guideListWithGuideWithWrongDataType() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      attributes: {
        ...guides.attributes,
        title: 12345, // Wrong data type: it should be a string
        description: 67890, // Wrong data type: it should be a string
      },
    })),
  };
}

export function guideListPagesWithMissingProductSlug() {
  const guidesList = strapiGuideListPagesData;
  return {
    ...guidesList,
    data: guidesList.data.map((guides) => ({
      ...guides,
      attributes: {
        ...guides.attributes,
        product: {
          data: {
            ...guides.attributes.product.data,
            attributes: {
              ...guides.attributes.product.data.attributes,
              slug: undefined,
            },
          },
        },
      },
    })),
  } as unknown as StrapiGuideListPages;
}
