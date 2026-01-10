import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiQuickStartGuides } from '@/lib/strapi/types/quickStartGuides';

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
        populate: '*,metaImage,metaSocial.image',
      },
      localizations: {
        populate: '*',
      },
    },
  });

export const fetchQuickStartGuides = fetchFromStrapi<StrapiQuickStartGuides>(
  'quickstart-guides',
  makeStrapiQuickStartGuidesPopulate()
);

export const fetchAllQuickStartGuides = fetchFromStrapi<StrapiQuickStartGuides>(
  'quickstart-guides',
  makeStrapiQuickStartGuidesPopulate() + '&locale=all'
);
