import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import qs from 'qs';
import type { StrapiQuickStartGuides } from './strapiTypes';

const makeStrapiQuickStartGuidesPopulate = () =>
  qs.stringify({
    populate: {
      quickstartGuideItems: {
        populate: {
          parts: {
            on: {
              'parts.api-tester': {
                populate: ['requestCode', 'requestAttributes', 'responseCode'],
              },
              'parts.html': { populate: '*' },
              'parts.alert': { populate: '*' },
              'parts.code-block': { populate: '*' },
              'parts.embed-html': { populate: '*' },
              'parts.quote': { populate: '*' },
            },
          },
        },
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
