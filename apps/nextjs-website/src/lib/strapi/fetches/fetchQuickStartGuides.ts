import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiQuickStartGuides } from '@/lib/strapi/types/quickStartGuides';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

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

export const fetchQuickStartGuides = fetchFromStrapi<
  RootEntity<StrapiQuickStartGuides>
>('quickstart-guides', makeStrapiQuickStartGuidesPopulate());
