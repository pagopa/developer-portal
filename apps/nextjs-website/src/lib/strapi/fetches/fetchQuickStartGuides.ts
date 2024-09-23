import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { QuickStartGuidesCodec } from '@/lib/strapi/codecs/QuickStartGuidesCodec';

const makeStrapiQuickStartGuidesPopulate = () =>
  qs.stringify({
    populate: {
      quickstartGuideItems: {
        populate:
          'parts.responseCode,parts.requestCode,parts.requestAttributes',
      },
      product: { populate: ['logo', 'bannerLinks.icon'] },
    },
  });

export const fetchQuickStartGuides = fetchFromStrapi(
  'quickstart-guides',
  makeStrapiQuickStartGuidesPopulate(),
  QuickStartGuidesCodec
);
