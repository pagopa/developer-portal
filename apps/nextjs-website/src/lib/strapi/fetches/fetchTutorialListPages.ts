import * as qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { StrapiTutorialListPagesCodec } from '../codecs/TutorialListPagesCodec';

const makeStrapiTutorialListPagePopulate = () =>
  qs.stringify({
    populate: {
      product: '*',
      tutorials: {
        populate: ['image', 'product'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchTutorialListPages = fetchFromStrapi(
  'tutorial-list-pages',
  makeStrapiTutorialListPagePopulate(),
  StrapiTutorialListPagesCodec
);
