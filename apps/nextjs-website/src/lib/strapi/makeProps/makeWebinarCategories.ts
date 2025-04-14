import { StrapiWebinarCategories } from '@/lib/strapi/codecs/WebinarCategoryCodec';
import { WebinarCategory } from '@/lib/types/webinarCategory';

export function makeWebinarCategoriesProps(
  strapiWebinarCategories: StrapiWebinarCategories
): ReadonlyArray<WebinarCategory> {
  return strapiWebinarCategories.data.map(makeWebinarCategoryProps);
}

export function makeWebinarCategoryProps(
  webinarCategory: StrapiWebinarCategories['data'][0]
): WebinarCategory {
  return {
    name: webinarCategory.attributes.name,
    icon: webinarCategory.attributes.icon.data.attributes,
  };
}
