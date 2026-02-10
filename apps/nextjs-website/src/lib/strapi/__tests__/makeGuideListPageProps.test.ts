/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeGuideListPagesProps } from '@/lib/strapi/makeProps/makeGuideListPages';
import {
  guideListPagesProps,
  strapiEmptyGuideListPagesData,
  strapiGuideListPagesData,
} from '@/lib/strapi/__tests__/fixtures/guideListPages';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';
import {
  guideListPagesWithItemMissingProductSlug,
  guideListPagesWithItemsMissingListItem,
  guideListPagesWithItemsWithWrongDataType,
  guideListPagesWithItemsMissingImages,
  guideListPagesWithItemsMissingSlug,
} from '@/lib/strapi/__tests__/factories/guideListPages';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('makeGuideListPageProps', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should return an empty array when no guides are provided', () => {
    const result = makeGuideListPagesProps('it', strapiEmptyGuideListPagesData);
    expect(result).toEqual([]);
  });

  it('should return an array with a single element with the guides for the PagoPA product', () => {
    const result = makeGuideListPagesProps('it', strapiGuideListPagesData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideListPagesProps);
  });

  it('should return a single element array of type GuideListPageProps with only one guide', () => {
    const guideListWithMissingSlugsData =
      guideListPagesWithItemsMissingSlug() as unknown as StrapiGuideListPages;
    const result = makeGuideListPagesProps('it', guideListWithMissingSlugsData);
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
      guideListPagesWithItemsMissingImages() as unknown as StrapiGuideListPages;
    const result = makeGuideListPagesProps(
      'it',
      guideListWithMissingImagesData
    );
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
      guideListPagesWithItemsMissingListItem() as unknown as StrapiGuideListPages;
    const result = makeGuideListPagesProps('it', guideListWithInvalidData);
    expect(result).toHaveLength(1);
    expect(result[0].guidesSections).toHaveLength(2);
    expect(result[0].guidesSections?.[0].guides).toHaveLength(1);
    expect(spyOnConsoleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return a single element array with abstract title and description as numbers', () => {
    const guideListWithNumbers =
      guideListPagesWithItemsWithWrongDataType() as any;

    const result = makeGuideListPagesProps('it', guideListWithNumbers);
    expect(result).toHaveLength(1);
    expect(result[0].abstract).toEqual({
      title: 12345,
      description: 67890,
    });
  });

  it('should return an empty array if all guide list pages have missing product slugs', () => {
    const result = makeGuideListPagesProps(
      'it',
      guideListPagesWithItemMissingProductSlug()
    );
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing GuideListPage with title "Guide e manuali": missing product slug. Skipping...'
    );
  });
});
