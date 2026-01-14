import {
  makeWebinarCategoriesProps,
  makeWebinarCategoryProps,
} from '@/lib/strapi/makeProps/makeWebinarCategories';
import { strapiWebinarCategories } from './fixtures/webinarCategory';
import { StrapiWebinarCategory } from '../types/webinarCategory';
import { mediaJpeg } from './factories/media';

describe('makeWebinarCategoriesProps', () => {
  it('should transform strapi webinar categories to WebinarCategory array', () => {
    const result = makeWebinarCategoriesProps(strapiWebinarCategories);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Payments',
      icon: { data: mediaJpeg() },
    });
    expect(result[1]).toEqual({
      name: 'Onboarding',
      icon: { data: mediaJpeg() },
    });
  });

  it('should handle empty categories array', () => {
    const emptyCategories = { ...strapiWebinarCategories, data: [] };
    const result = makeWebinarCategoriesProps(emptyCategories);
    expect(result).toEqual([]);
  });
});

describe('makeWebinarCategoryProps', () => {
  it('should transform single strapi webinar category', () => {
    const category = strapiWebinarCategories.data[0];
    const result = makeWebinarCategoryProps(category);
    expect(result).toEqual({
      name: 'Payments',
      icon: { data: mediaJpeg() },
    });
  });

  it('should handle missing icon', () => {
    const category = {
      ...strapiWebinarCategories.data[0],
      attributes: {
        ...strapiWebinarCategories.data[0].attributes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon: undefined as any,
      },
    } satisfies StrapiWebinarCategory;

    const result = makeWebinarCategoryProps(category);
    expect(result).toEqual({
      name: 'Payments',
      icon: undefined,
    });
  });
});
