import * as qs from 'qs';
import { productRelationsPopulate } from './fetchProducts';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

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

export const fetchTutorials = fetchFromStrapi<RootEntity<StrapiTutorials>>(
  'tutorials',
  makeStrapiTutorialsPopulate()
);
