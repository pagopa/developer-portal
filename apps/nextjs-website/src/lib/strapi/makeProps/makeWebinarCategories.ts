import {
  StrapiWebinarCategories,
  StrapiWebinarCategory,
} from '@/lib/strapi/types/webinarCategory';
import { WebinarCategory } from '@/lib/types/webinarCategory';

export function makeWebinarCategoriesProps(
  strapiWebinarCategories: StrapiWebinarCategories
): ReadonlyArray<WebinarCategory> {
  return strapiWebinarCategories.data.map(makeWebinarCategoryProps);
}

export function makeWebinarCategoryProps(
  webinarCategory: StrapiWebinarCategory
): WebinarCategory {
  return {
    name: webinarCategory.name,
    icon: webinarCategory.icon,
  };
}
