import * as qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { TutorialsCodec } from '../codecs/TutorialCodec';
import { productPopulate } from './fetchProducts';

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
        ...productPopulate,
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
