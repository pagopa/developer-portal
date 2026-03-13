import * as qs from 'qs';
import { productRelationsPopulate } from '@/lib/product/fetcher';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';

const makeStrapiTutorialsPopulate = () =>
  qs.stringify({
    populate: {
      relatedLinks: {
        populate: ['links'],
      },
      description: '*',
      icon: { populate: ['icon'] },
      image: {
        populate: ['image'],
      },
      parts: '*',
      product: {
        ...productRelationsPopulate,
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
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
