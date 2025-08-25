import {
  guideProps,
  strapiEmptyGuideData,
  strapiGuideData,
} from '@/lib/strapi/__tests__/fixtures/guides';
import { makeGuidesProps } from '@/lib/strapi/makeProps/makeGuides';

describe('makeGuidesProps', () => {
  it('should return an empty array when no guides are provided', () => {
    const result = makeGuidesProps(strapiEmptyGuideData);
    expect(result).toEqual([]);
  });

  it('should return a single page with the provided guides', () => {
    const result = makeGuidesProps(strapiGuideData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideProps);
  });
});
