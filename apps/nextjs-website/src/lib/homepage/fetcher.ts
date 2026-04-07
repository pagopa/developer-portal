import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { webinarPopulate } from '@/lib/webinars/fetcher';
import { StrapiHomepage } from './types';

export const homepagePopulate = {
  populate: {
    comingsoonDocumentation: {
      populate: ['links'],
    },
    heroSlider: {
      populate: ['backgroundImage', 'callToAction.link'],
    },
    newsShowcase: {
      populate: ['link', 'items.image', 'items.link'],
    },
    webinars: webinarPopulate,
    ecosystem: {
      populate: {
        products: {
          populate: ['logo'],
        },
        solutions: {
          populate: '*',
        },
        solutionsCta: {
          populate: ['link'],
        },
      },
    },
  },
  seo: {
    populate: '*',
  },
};

const makeHomepagePopulate = () => qs.stringify(homepagePopulate);

export const fetchHomepage = fetchFromStrapi<StrapiHomepage>(
  'homepage',
  makeHomepagePopulate()
);
