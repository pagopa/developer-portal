import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { OverviewsCodec } from '@/lib/strapi/codecs/OverviewsCodec';
import { productPopulate } from './fetchProducts';

const makeStrapiOverviewsPopulate = () =>
  qs.stringify({
    populate: {
      backgroundImage: '*',
      product: {
        ...productPopulate,
      },
      relatedLinks: {
        populate: ['links'],
      },
      features: {
        populate: ['items.icon'],
      },
      startInfoSection: {
        populate: ['bottomLink', 'items.icon'],
      },
      tutorialSection: {
        populate: ['tutorials.image', 'tutorials.product'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
      postIntegration: {
        populate: [
          'link',
          'guides.image',
          'guides.listItems',
          'guides.mobileImage',
          'documents.image',
          'documents.mobileImage',
          'serviceModels',
        ],
      },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchOverviews = fetchFromStrapi(
  'overviews',
  makeStrapiOverviewsPopulate(),
  OverviewsCodec
);
