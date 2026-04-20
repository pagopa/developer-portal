import { mapTagProps, mapTagsProps } from '@/lib/tags/mapper';
import { strapiTags } from '@/lib/tags/__tests__/fixtures';
import { mediaJpeg } from '@/lib/media/__tests__/factories';

describe('mapTagsProps', () => {
  it('should transform strapi tags to Tag array', () => {
    const result = mapTagsProps(strapiTags);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Payments',
      icon: mediaJpeg(),
    });
    expect(result[1]).toEqual({
      name: 'Onboarding',
      icon: mediaJpeg(),
    });
  });

  it('should handle empty tags array', () => {
    const emptyTags = { ...strapiTags, data: [] };
    const result = mapTagsProps(emptyTags);

    expect(result).toEqual([]);
  });
});

describe('mapTagProps', () => {
  it('should transform a single strapi tag', () => {
    const result = mapTagProps(strapiTags.data[0]);

    expect(result).toEqual({
      name: 'Payments',
      icon: mediaJpeg(),
    });
  });
});
