import { StrapiWebinarCategories, StrapiWebinarCategory } from './types';
import { WebinarCategory } from '@/lib/types/webinarCategory';

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
