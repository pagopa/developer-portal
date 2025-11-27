import * as qs from 'qs';
import { productRelationsPopulate } from './fetchProducts';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiUseCases } from '../types/useCase';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const makeStrapiUseCasesPopulate = () =>
  qs.stringify({
    populate: {
      bannerLinks: {
        populate: ['icon'],
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
      relatedLinks: {
        populate: ['links'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
      tags: {
        populate: '*',
      },
    },
  });

export const fetchUseCases = fetchFromStrapi<RootEntity<StrapiUseCases>>(
  'use-cases',
  makeStrapiUseCasesPopulate()
);
