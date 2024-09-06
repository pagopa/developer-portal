import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { ApiDataListPagesCodec } from '@/lib/strapi/codecs/ApiDataListPagesCodec';

const makeStrapiApiDataListPagePopulate = () =>
  qs.stringify({
    populate: {
      apiData: {
        populate: {
          apiRestDetail: {
            populate: ['slug', 'specUrls'],
          },
          icon: { populate: '*' },
        },
      },
      product: {
        populate: ['logo'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
    },
  });

export const fetchApiDataListPages = fetchFromStrapi(
  'api-data-list-pages',
  makeStrapiApiDataListPagePopulate(),
  ApiDataListPagesCodec
);
