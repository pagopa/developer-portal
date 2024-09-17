import * as qs from 'qs';
import { CaseHistoriesCodec } from '@/lib/strapi/codecs/CaseHistoriesCodec';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';

const makeStrapiCaseHistoriesPopulate = () =>
  qs.stringify({
    populate: {
      image: 'image',
      parts: {
        populate: [
          'responseCode',
          'requestCode',
          'requestAttributes',
          'backgroundImage',
        ],
      },
      products: {
        populate: ['logo'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchCaseHistories = fetchFromStrapi(
  'case-histories',
  makeStrapiCaseHistoriesPopulate(),
  CaseHistoriesCodec
);
