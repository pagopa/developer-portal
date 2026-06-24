/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapGuideListPages } from '@/lib/guideListPages/mapper';
import {
  guideListPagesProps,
  strapiEmptyGuideListPagesData,
  strapiGuideListPagesData,
} from '@/lib/guideListPages/__tests__/fixtures';
import {
  guideListPagesWithItemMissingProductSlug,
  guideListPagesWithItemsMissingListItem,
  guideListPagesWithItemsWithWrongDataType,
  guideListPagesWithItemsMissingImages,
  guideListPagesWithItemsMissingSlug,
} from '@/lib/guideListPages/__tests__/factories';
import { spyOnConsoleError } from '@/lib/__tests__/spyOnConsole';

describe('mapGuideListPages', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should return an empty array when no guides are provided', () => {
    const result = mapGuideListPages('it', strapiEmptyGuideListPagesData);
    expect(result).toEqual([]);
  });

  it('should return an array with a single element with the guides for the PagoPA product', () => {
    const result = mapGuideListPages('it', strapiGuideListPagesData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideListPagesProps);
  });

  it('should return a single element array of type GuideListPageProps with only one guide', () => {
    const guideListWithMissingSlugsData = guideListPagesWithItemsMissingSlug();
    const result = mapGuideListPages('it', guideListWithMissingSlugsData);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...guideListPagesProps[0],
      guidesSections: guideListPagesProps[0].guidesSections.map((section) => ({
        ...section,
        guides: [],
      })),
    });
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'guide slug is missing:',
      expect.any(Object)
    );
  });

  it('should return a single element array of type GuideListPageProps with guides without images', () => {
    const guideListWithMissingImagesData =
      guideListPagesWithItemsMissingImages();
    const result = mapGuideListPages('it', guideListWithMissingImagesData);
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
    const guideListWithInvalidData = guideListPagesWithItemsMissingListItem();
    const result = mapGuideListPages('it', guideListWithInvalidData);
    expect(result).toHaveLength(1);
    expect(result[0].guidesSections).toHaveLength(2);
    expect(result[0].guidesSections?.[0].guides).toHaveLength(1);
    expect(spyOnConsoleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return a single element array with abstract title and description as numbers', () => {
    const guideListWithNumbers =
      guideListPagesWithItemsWithWrongDataType() as any;

    const result = mapGuideListPages('it', guideListWithNumbers);
    expect(result).toHaveLength(1);
    expect(result[0].abstract).toEqual({
      title: 12345,
      description: 67890,
    });
  });

  it('should return an empty array if all guide list pages have missing product slugs', () => {
    const result = mapGuideListPages(
      'it',
      guideListPagesWithItemMissingProductSlug()
    );
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing GuideListPage with title "Guide e manuali": missing product slug. Skipping...'
    );
  });
});
