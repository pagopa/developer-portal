import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { WebinarCategoriesCodec } from '@/lib/strapi/codecs/WebinarCategoryCodec';
import qs from 'qs';

const makeStrapiWebinarCategoriesPopulate = () =>
  qs.stringify({
    populate: {
      icon: { populate: '*' },
    },
  });

export const fetchWebinarCategories = (locale?: string) =>
  fetchFromStrapi(
    'webinar-categories',
    makeStrapiWebinarCategoriesPopulate(),
    WebinarCategoriesCodec,
    locale
  );
