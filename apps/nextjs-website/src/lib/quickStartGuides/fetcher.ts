import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import qs from 'qs';
import type { StrapiQuickStartGuides } from './strapiTypes';

const makeStrapiQuickStartGuidesPopulate = () =>
  qs.stringify({
    populate: {
      quickstartGuideItems: {
        populate:
          'parts.responseCode,parts.requestCode,parts.requestAttributes',
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
    },
  });

export const fetchQuickStartGuides = fetchFromStrapi<StrapiQuickStartGuides>(
  'quickstart-guides',
  makeStrapiQuickStartGuidesPopulate()
);
