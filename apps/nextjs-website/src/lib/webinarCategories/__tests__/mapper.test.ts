import {
  mapWebinarCategoriesProps,
  mapWebinarCategoryProps,
} from '@/lib/webinarCategories/mapper';
import { strapiWebinarCategories } from '@/lib/webinarCategories/__tests__/fixtures';
import type { StrapiWebinarCategory } from '@/lib/webinarCategories/strapiTypes';
import { mediaJpeg } from '@/lib/media/__tests__/factories';
import type { StrapiMedia } from '@/lib/media/strapiTypes';

describe('mapWebinarCategoriesProps', () => {
  it('should transform strapi webinar categories to WebinarCategory array', () => {
    const result = mapWebinarCategoriesProps(strapiWebinarCategories);

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

  it('should handle empty categories array', () => {
    const emptyCategories = { ...strapiWebinarCategories, data: [] };
    const result = mapWebinarCategoriesProps(emptyCategories);

    expect(result).toEqual([]);
  });
});

describe('mapWebinarCategoryProps', () => {
  it('should transform single strapi webinar category', () => {
    const category = strapiWebinarCategories.data[0];
    const result = mapWebinarCategoryProps(category);

    expect(result).toEqual({
      name: 'Payments',
      icon: mediaJpeg(),
    });
  });

  it('should handle missing icon', () => {
    const category = {
      ...strapiWebinarCategories.data[0],
      icon: undefined as unknown as StrapiMedia,
    } satisfies StrapiWebinarCategory;

    const result = mapWebinarCategoryProps(category);

    expect(result).toEqual({
      name: 'Payments',
      icon: undefined,
    });
  });
});
