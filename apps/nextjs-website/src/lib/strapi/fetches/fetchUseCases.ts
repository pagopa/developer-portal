import * as qs from 'qs';
import { productRelationsPopulate } from './fetchProducts';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiUseCases } from '../types/useCase';

const makeStrapiUseCasesPopulate = () =>
  qs.stringify({
    populate: {
      relatedLinks: {
        populate: ['links'],
      },
      coverImage: {
        populate: ['image'],
      },
      headerImage: {
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
    },
  });

export const fetchUseCases = fetchFromStrapi<StrapiUseCases>(
  'use-cases',
  makeStrapiUseCasesPopulate()
);
