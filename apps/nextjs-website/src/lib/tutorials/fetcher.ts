import qs from 'qs';
import { buildEnv } from '@/lib/buildEnv';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { fetchCollectionFromStrapi } from '@/lib/strapi/fetchFromStrapi.helpers';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import type { StrapiTutorials } from './strapiTypes';

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

export const fetchTutorials = (locale: string) =>
  fetchFromStrapi<StrapiTutorials>('tutorials', makeStrapiTutorialsPopulate())(
    locale,
    buildEnv
  );

export const fetchProductTutorialsReader = (
  locale: string,
  productSlug: string
) =>
  fetchCollectionFromStrapi<StrapiTutorials>('tutorials', productSlug, {
    fields: ['slug', 'updatedAt'],
  })(locale, buildEnv);
