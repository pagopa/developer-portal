import {
  StrapiWebinarCategories,
  StrapiWebinarCategory,
} from '@/lib/strapi/types/webinarCategory';
import { WebinarCategory } from '@/lib/types/webinarCategory';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export function makeWebinarCategoriesProps(
  strapiWebinarCategories: RootEntity<StrapiWebinarCategories>
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
