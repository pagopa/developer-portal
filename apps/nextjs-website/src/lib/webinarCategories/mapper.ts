import type {
  StrapiWebinarCategories,
  StrapiWebinarCategory,
} from './strapiTypes';
import type { WebinarCategory } from './types';

export function mapWebinarCategoriesProps(
  strapiWebinarCategories: StrapiWebinarCategories
): ReadonlyArray<WebinarCategory> {
  return strapiWebinarCategories.data.map(mapWebinarCategoryProps);
}

export function mapWebinarCategoryProps(
  webinarCategory: StrapiWebinarCategory
): WebinarCategory {
  return {
    name: webinarCategory.name,
    icon: webinarCategory.icon,
  };
}
