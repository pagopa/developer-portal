import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiTags } from '@/lib/strapi/types/tag';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

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
