import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/fetches/fetchWebinars';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { HomepageCodec } from '@/lib/strapi/codecs/HomepageCodec';

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
        populate: ['items.image', 'items.link'],
      },
      productsShowcase: {
        populate: ['products.logo'],
      },
      webinars: webinarPopulate,
      ecosystem: {
        populate: [
          'products.logo',
          'solutions.icon',
          'solutions.product',
          'solutions.product.logo',
          'solutionsCta.link',
        ],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  makeStrapiHomepagePopulate(),
  HomepageCodec
);
