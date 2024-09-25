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
        populate: ['logo', 'bannerLinks.icon'],
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
