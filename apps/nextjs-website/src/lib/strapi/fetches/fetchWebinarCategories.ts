import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiWebinarCategories } from '@/lib/strapi/types/webinarCategory';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const makeStrapiWebinarCategoriesPopulate = () =>
  qs.stringify({
    populate: {
      icon: { populate: '*' },
    },
  });

export const fetchWebinarCategories = fetchFromStrapi<
  RootEntity<StrapiWebinarCategories>
>('webinar-categories', makeStrapiWebinarCategoriesPopulate());
