import { strapiGuideListPaginatedData } from '@/lib/strapi/__tests__/fixtures/guideLists';

export function guideListWithMissingSlugs() {
  const guidesList = strapiGuideListPaginatedData;
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
  const guidesList = strapiGuideListPaginatedData;
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
  const guidesList = strapiGuideListPaginatedData;
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
