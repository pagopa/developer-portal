import * as qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { TutorialsCodec } from '../codecs/TutorialCodec';

const makeStrapiTutorialsPopulate = () =>
  qs.stringify({
    populate: {
      relatedLinks: {
        populate: ['links'],
      },
      image: {
        populate: ['image'],
      },
      parts: '*',
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
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchTutorials = fetchFromStrapi(
  'tutorials',
  makeStrapiTutorialsPopulate(),
  TutorialsCodec
);
