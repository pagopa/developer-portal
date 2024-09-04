import * as qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { StrapiTutorialsCodec } from '../codecs/TutorialCodec';

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
      product: { populate: 'logo' },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchTutorials = fetchFromStrapi(
  'tutorials',
  makeStrapiTutorialsPopulate(),
  StrapiTutorialsCodec
);