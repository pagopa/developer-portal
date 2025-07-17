import { makeGuideListPagesProps } from '@/lib/strapi/makeProps/makeGuideListPages';
import {
  guideListPageProps,
  strapiEmptyGuideListPaginatedData,
  strapiGuideListPaginatedData,
} from '@/lib/strapi/__tests__/fixtures/guideLists';
import { StrapiGuideListPaginated } from '@/lib/strapi/types/guideList';

describe('makeGuideListPageProps', () => {
  it('should return an empty array when no guides are provided', () => {
    const result = makeGuideListPagesProps(strapiEmptyGuideListPaginatedData);
    expect(result).toEqual([]);
  });

  it('should return an a array with a single element with the guides for the PagoPA product', () => {
    const result = makeGuideListPagesProps(strapiGuideListPaginatedData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideListPageProps);
  });

  it('should return a single element array of type GuideListPageProps with only one guide', () => {
    const guideListWithMissingSlugsData = guideListWithMissingSlugs(
      strapiGuideListPaginatedData
    ) as unknown as StrapiGuideListPaginated;
    const result = makeGuideListPagesProps(guideListWithMissingSlugsData);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...guideListPageProps[0],
      guidesSections: guideListPageProps[0].guidesSections.map((section) => ({
        ...section,
        guides: [],
      })),
    });
  });

  it('should return a single element array of type GuideListPageProps with guides without images', () => {
    const guideListWithMissingImagesData = guideListWithMissingImages(
      strapiGuideListPaginatedData
    ) as unknown as StrapiGuideListPaginated;
    const result = makeGuideListPagesProps(guideListWithMissingImagesData);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...guideListPageProps[0],
      guidesSections: guideListPageProps[0].guidesSections.map((section) => ({
        ...section,
        guides: section.guides.map((guide) => ({
          ...guide,
          imagePath: undefined,
          mobileImagePath: undefined,
        })),
      })),
    });
  });

  it('should return a single element array of type GuideListPageProps with only one guide', () => {
    const guideListWithInvalidData = guideListWithGuideWithUndefinedListItem(
      strapiGuideListPaginatedData
    ) as unknown as StrapiGuideListPaginated;
    const result = makeGuideListPagesProps(guideListWithInvalidData);
    expect(result).toHaveLength(1);
    expect(result[0].guidesSections).toHaveLength(2);
    expect(result[0].guidesSections?.[0].guides).toHaveLength(1);
  });
});

function guideListWithMissingSlugs(guidesList: StrapiGuideListPaginated) {
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

function guideListWithMissingImages(guidesList: StrapiGuideListPaginated) {
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

function guideListWithGuideWithUndefinedListItem(
  guidesList: StrapiGuideListPaginated
) {
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
