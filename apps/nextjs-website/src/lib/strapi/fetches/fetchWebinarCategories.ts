import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { WebinarCategory } from '@/lib/types/webinarCategory';

const makeStrapiWebinarCategoriesPopulate = () =>
  qs.stringify({
    populate: {
      icon: { populate: '*' },
    },
  });

export const fetchWebinarCategories = fetchFromStrapi<WebinarCategory>(
  'webinar-categories',
  makeStrapiWebinarCategoriesPopulate()
);
