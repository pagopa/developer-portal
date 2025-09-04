/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeGuideListPages } from '@/lib/strapi/makeProps/makeGuideListPages';
import {
  guideListPagesProps,
  strapiEmptyGuideListPagesData,
  strapiGuideListPagesData,
} from '@/lib/strapi/__tests__/fixtures/guideListPages';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';
import {
  guideListPagesWithMissingProductSlug,
  guideListWithGuideWithUndefinedListItem,
  guideListWithGuideWithWrongDataType,
  guideListWithMissingImages,
  guideListWithMissingSlugs,
} from '@/lib/strapi/__tests__/factories/guideListPages';

describe('makeGuideListPage', () => {
  it('should return an empty array when no guides are provided', () => {
    const result = makeGuideListPages(strapiEmptyGuideListPagesData);
    expect(result).toEqual([]);
  });

  it('should return an array with a single element with the guides for the PagoPA product', () => {
    const result = makeGuideListPages(strapiGuideListPagesData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideListPagesProps);
  });

  it('should return a single element array of type GuideListPageProps with only one guide', () => {
    const guideListWithMissingSlugsData =
      guideListWithMissingSlugs() as unknown as StrapiGuideListPages;
    const result = makeGuideListPages(guideListWithMissingSlugsData);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...guideListPagesProps[0],
      guidesSections: guideListPagesProps[0].guidesSections.map((section) => ({
        ...section,
        guides: [],
      })),
    });
  });

  it('should return a single element array of type GuideListPageProps with guides without images', () => {
    const guideListWithMissingImagesData =
      guideListWithMissingImages() as unknown as StrapiGuideListPages;
    const result = makeGuideListPages(guideListWithMissingImagesData);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...guideListPagesProps[0],
      guidesSections: guideListPagesProps[0].guidesSections.map((section) => ({
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
    const guideListWithInvalidData =
      guideListWithGuideWithUndefinedListItem() as unknown as StrapiGuideListPages;
    const result = makeGuideListPages(guideListWithInvalidData);
    expect(result).toHaveLength(1);
    expect(result[0].guidesSections).toHaveLength(2);
    expect(result[0].guidesSections?.[0].guides).toHaveLength(1);
  });

  it('should return a single element array with abstract title and description as numbers', () => {
    const guideListWithNumbers = guideListWithGuideWithWrongDataType() as any;

    const result = makeGuideListPages(guideListWithNumbers);
    expect(result).toHaveLength(1);
    expect(result[0].abstract).toEqual({
      title: 12345,
      description: 67890,
    });
  });

  it('should return an empty array if all guide list pages have missing product slugs', () => {
    const result = makeGuideListPages(guideListPagesWithMissingProductSlug());
    expect(result).toHaveLength(0);
  });
});
