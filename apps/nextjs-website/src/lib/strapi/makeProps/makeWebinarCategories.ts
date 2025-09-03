import {
  StrapiWebinarCategories,
  StrapiWebinarCategory,
} from '@/lib/strapi/types/webinarCategory';
import { WebinarCategory } from '@/lib/types/webinarCategory';

export function makeWebinarCategories(
  strapiWebinarCategories: StrapiWebinarCategories
): ReadonlyArray<WebinarCategory> {
  return strapiWebinarCategories.data.map(makeWebinarCategory);
}

export function makeWebinarCategory(
  webinarCategory: StrapiWebinarCategory
): WebinarCategory {
  return {
    name: webinarCategory.attributes.name,
    icon: webinarCategory.attributes.icon,
  };
}
