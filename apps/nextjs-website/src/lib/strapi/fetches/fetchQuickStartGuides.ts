import * as qs from 'qs';
import { deprecatedFetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { QuickStartGuidesCodec } from '@/lib/strapi/codecs/QuickStartGuidesCodec';
import { productRelationsPopulate } from './fetchProducts';

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
    },
  });

export const fetchQuickStartGuides = deprecatedFetchFromStrapi(
  'quickstart-guides',
  makeStrapiQuickStartGuidesPopulate(),
  QuickStartGuidesCodec
);
