import {
  guideProps,
  strapiEmptyGuideData,
  strapiGuideData,
} from '@/lib/strapi/__tests__/fixtures/guides';
import { makeGuides } from '@/lib/strapi/makeProps/makeGuides';

describe('makeGuides', () => {
  it('should return an empty array when no guides are provided', () => {
    const result = makeGuides(strapiEmptyGuideData);
    expect(result).toEqual([]);
  });

  it('should return an array containing only one object of type GuideDefinition', () => {
    const result = makeGuides(strapiGuideData);
    expect(result).toHaveLength(1);
    expect(result).toEqual(guideProps);
  });
});
