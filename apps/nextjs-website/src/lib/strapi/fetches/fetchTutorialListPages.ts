import * as qs from 'qs';
import { fetchFromStrapi } from '../fetchFromStrapi';
import { TutorialListPagesCodec } from '../codecs/TutorialListPagesCodec';

const makeStrapiTutorialListPagePopulate = () =>
  qs.stringify({
    populate: {
      product: {
        populate: ['bannerLinks.icon'],
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
