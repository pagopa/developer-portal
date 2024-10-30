import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { QuickStartGuidesCodec } from '@/lib/strapi/codecs/QuickStartGuidesCodec';
import { productPopulate } from './fetchProducts';

const makeStrapiQuickStartGuidesPopulate = () =>
  qs.stringify({
    populate: {
      quickstartGuideItems: {
        populate:
          'parts.responseCode,parts.requestCode,parts.requestAttributes',
      },
      product: {
        ...productPopulate,
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchQuickStartGuides = fetchFromStrapi(
  'quickstart-guides',
  makeStrapiQuickStartGuidesPopulate(),
  QuickStartGuidesCodec
);
