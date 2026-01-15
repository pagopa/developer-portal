import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiWebinars } from '@/lib/strapi/types/webinars';

export const webinarPopulate = {
  populate: {
    coverImage: {
      populate: '*',
    },
    playerCoverImage: {
      populate: '*',
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
          populate: '*',
        },
        downloadableDocuments: {
          populate: '*',
        },
      },
    },
    seo: {
      populate: '*',
    },
    questionsAndAnswers: '*',
    webinarCategory: { populate: ['icon'] },
    headerImage: {
      populate: '*',
    },
  },
};

const makeStrapiWebinarsPopulate = () => qs.stringify(webinarPopulate);

export const fetchWebinars = fetchFromStrapi<StrapiWebinars>(
  'webinars',
  makeStrapiWebinarsPopulate()
);
