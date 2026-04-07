import qs from 'qs';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiUseCases } from './types';

const makeStrapiUseCasesPopulate = () =>
  qs.stringify({
    populate: {
      bannerLinks: {
        populate: ['icon'],
      },
      coverImage: {
        populate: '*',
      },
      headerImage: {
        populate: '*',
      },
      parts: {
        on: {
          'parts.html': { populate: '*' },
          'parts.alert': { populate: '*' },
          'parts.ck-editor': { populate: '*' },
          'parts.code-block': { populate: '*' },
          'parts.embed-html': { populate: '*' },
          'parts.markdown': { populate: '*' },
        },
      },
      product: {
        ...productRelationsPopulate,
      },
      relatedLinks: {
        populate: ['links'],
      },
      seo: {
        populate: '*',
      },
      tags: {
        populate: '*',
      },
    },
  });

export const fetchUseCases = fetchFromStrapi<StrapiUseCases>(
  'use-cases',
  makeStrapiUseCasesPopulate()
);
