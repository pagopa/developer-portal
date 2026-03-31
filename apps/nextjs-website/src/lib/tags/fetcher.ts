import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import type { StrapiTags } from './strapiTypes';

const makeStrapiTagsPopulate = () =>
  qs.stringify({
    populate: {
      icon: { populate: '*' },
    },
  });

export const fetchTags = fetchFromStrapi<StrapiTags>(
  'tags',
  makeStrapiTagsPopulate()
);
