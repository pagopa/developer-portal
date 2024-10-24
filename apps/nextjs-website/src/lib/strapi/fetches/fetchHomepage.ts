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
          'products.bannerLinks.icon',
          'products.overview',
          'products.quickstart_guide',
          'products.api_data_list_page',
          'products.api_data_list_page.apiData.*',
          'products.api_data_list_page.apiData.apiRestDetail.*',
          'products.guide_list_page',
          'products.tutorial_list_page',
          'solutions.icon',
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
