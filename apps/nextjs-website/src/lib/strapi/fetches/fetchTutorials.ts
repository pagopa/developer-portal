import * as qs from 'qs';
import { productRelationsPopulate } from './fetchProducts';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';

const makeStrapiTutorialsPopulate = () =>
  qs.stringify({
    populate: {
      image: {
        populate: '*',
      },
      parts: {
        populate: '*',
      },
      relatedLinks: {
        populate: ['links'],
      },
      product: {
        ...productRelationsPopulate,
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*',
      },
      tags: {
        populate: '*',
      },
    },
  });

export const fetchTutorials = fetchFromStrapi<StrapiTutorials>(
  'tutorials',
  makeStrapiTutorialsPopulate()
);
