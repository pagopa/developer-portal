import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiWebinarCategories } from '@/lib/strapi/types/webinarCategory';

const makeStrapiWebinarCategoriesPopulate = () =>
  qs.stringify({
    populate: {
      icon: { populate: '*' },
    },
  });

export const fetchWebinarCategories = fetchFromStrapi<StrapiWebinarCategories>(
  'webinar-categories',
  makeStrapiWebinarCategoriesPopulate()
);
