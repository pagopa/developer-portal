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
                  slug: undefined, // Assign a default slug if missing
                },
              })),
            },
          })
        ),
      },
    })),
  };
}
