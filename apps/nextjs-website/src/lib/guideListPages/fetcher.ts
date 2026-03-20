import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/product/fetcher';
import { StrapiGuideListPages } from './types';
import { buildEnv } from '@/lib/buildEnv';

const makeStrapiGuideListPopulate = () =>
  qs.stringify({
    populate: {
      product: {
        ...productRelationsPopulate,
      },
      guidesByCategory: {
        populate: ['guides.mobileImage', 'guides.image', 'guides.listItems'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*',
      },
    },
  });

export const fetchGuideListPages = (locale: string) =>
  fetchFromStrapi<StrapiGuideListPages>(
    'guide-list-pages',
    makeStrapiGuideListPopulate()
  )(locale, buildEnv);
