import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/fetches/fetchWebinars';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiHomepage } from '@/lib/strapi/types/homepage';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const makeStrapiHomepagePopulate = () =>
  qs.stringify({
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
  });

export const fetchHomepage = fetchFromStrapi<RootEntity<StrapiHomepage>>(
  'homepage',
  makeStrapiHomepagePopulate()
);
