import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import { StrapiOverviews } from './types';

export const overviewsPopulate = {
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
};

const makeOverviewsPopulate = () => qs.stringify(overviewsPopulate);

export const fetchOverviews = fetchFromStrapi<StrapiOverviews>(
  'overviews',
  makeOverviewsPopulate()
);
