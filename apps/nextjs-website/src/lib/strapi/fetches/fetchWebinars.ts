import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiWebinars } from '@/lib/strapi/types/webinars';

export const webinarPopulate = {
  populate: {
    coverImage: {
      populate: ['image'],
    },
    webinarSpeakers: {
      populate: ['avatar'],
    },
    relatedLinks: {
      populate: ['links'],
    },
    relatedResources: {
      populate: {
        resources: {
          populate: ['image'],
        },
        downloadableDocuments: {
          populate: '*',
        },
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    questionsAndAnswers: '*',
    webinarCategory: { populate: ['icon'] },
    headerImage: {
      populate: ['image'],
    },
  },
};

const makeStrapiWebinarsPopulate = () => qs.stringify(webinarPopulate);

export const fetchWebinars = fetchFromStrapi<StrapiWebinars>(
  'webinars',
  makeStrapiWebinarsPopulate()
);
