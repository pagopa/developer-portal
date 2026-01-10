import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';

const makeStrapiOverviewsPopulate = () =>
  qs.stringify({
    populate: {
      backgroundImage: {
        populate: '*',
      },
      product: {
        ...productRelationsPopulate,
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
        populate: ['tutorials.image', 'tutorials.product', 'tutorials.icon'],
      },
      useCaseSection: {
        populate: ['useCases.coverImage', 'useCases.product'],
      },
      seo: {
        populate: '*',
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
      whatsNew: {
        populate: ['link', 'items.image', 'items.link'],
      },
    },
  });

export const fetchOverviews = fetchFromStrapi<StrapiOverviews>(
  'overviews',
  makeStrapiOverviewsPopulate()
);
