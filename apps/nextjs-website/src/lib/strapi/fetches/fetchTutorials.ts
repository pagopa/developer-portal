import * as qs from 'qs';
import { deprecatedFetchFromStrapi } from '../fetchFromStrapi';
import { TutorialsCodec } from '../codecs/TutorialCodec';
import { productRelationsPopulate } from './fetchProducts';

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
        ...productRelationsPopulate,
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchTutorials = deprecatedFetchFromStrapi(
  'tutorials',
  makeStrapiTutorialsPopulate(),
  TutorialsCodec
);
