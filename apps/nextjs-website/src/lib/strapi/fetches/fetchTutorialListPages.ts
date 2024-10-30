import * as qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { TutorialListPagesCodec } from '../codecs/TutorialListPagesCodec';
import { productPopulate } from './fetchProducts';

const makeStrapiTutorialListPagePopulate = () =>
  qs.stringify({
    populate: {
      product: {
        ...productPopulate,
      },
      tutorials: {
        populate: ['image', 'product'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchTutorialListPages = fetchFromStrapi(
  'tutorial-list-pages',
  makeStrapiTutorialListPagePopulate(),
  TutorialListPagesCodec
);
