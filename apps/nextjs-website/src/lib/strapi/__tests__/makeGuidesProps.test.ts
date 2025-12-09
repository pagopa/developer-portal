import {
  guideProps,
  strapiEmptyGuideData,
  strapiGuideData,
} from '@/lib/strapi/__tests__/fixtures/guides';
import { makeGuidesProps } from '@/lib/strapi/makeProps/makeGuides';
import {
  guideListWithItemsWithEmptyProductSlug,
  guideListWithMissingProductSlug,
} from '@/lib/strapi/__tests__/factories/guides';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('makeGuidesProps', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should return an empty array when no guides are provided', () => {
    const result = makeGuidesProps(strapiEmptyGuideData);
    expect(result).toEqual([]);
  });

  it('should return an array containing only one object of type GuideDefinition', () => {
    const result = makeGuidesProps(strapiGuideData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideProps);
  });

  it('should return an empty array when the product slug is an empty string', () => {
    const result = makeGuidesProps(guideListWithItemsWithEmptyProductSlug());
    console.log('-------------------', result[0].product);
    expect(result).toEqual([]);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Guide with name "SACI": missing the product slug. Skipping...'
    );
  });

  it('should return an empty array when the product slug is undefined', () => {
    const result = makeGuidesProps(guideListWithMissingProductSlug());
    expect(result).toEqual([]);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Guide with name "SACI": missing the product slug. Skipping...'
    );
  });
});
