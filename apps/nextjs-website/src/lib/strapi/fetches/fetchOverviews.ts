import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { OverviewsCodec } from '@/lib/strapi/codecs/OverviewsCodec';

const makeStrapiOverviewsPopulate = () =>
  qs.stringify({
    populate: {
      backgroundImage: '*',
      product: {
        populate: [
          'logo',
          'bannerLinks.icon',
          'overview',
          'quickstart_guide',
          'api_data_list_page',
          'api_data_list_page.apiData.*',
          'api_data_list_page.apiData.apiRestDetail.*',
          'guide_list_page',
          'tutorial_list_page',
        ],
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
