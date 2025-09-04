import {
  guideProps,
  strapiEmptyGuideData,
  strapiGuideData,
} from '@/lib/strapi/__tests__/fixtures/guides';
import { makeGuidesProps } from '@/lib/strapi/makeProps/makeGuides';
import {
  makeGuidesWithProductWithEmptySlug,
  makeGuidesWithProductWithUndefinedSlug,
} from '@/lib/strapi/__tests__/factories/guides';

describe('makeGuidesProps', () => {
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
    const result = makeGuidesProps(makeGuidesWithProductWithEmptySlug());
    expect(result).toEqual([]);
  });

  it('should return an empty array when the product slug is undefined', () => {
    const result = makeGuidesProps(makeGuidesWithProductWithUndefinedSlug());
    expect(result).toEqual([]);
  });
});
