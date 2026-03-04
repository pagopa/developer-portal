import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { ApiDataList } from './types';

import { buildEnv } from '@/lib/buildEnv';

const makeStrapiApiDataListPopulate = () =>
  qs.stringify({
    populate: {
      apiRestDetail: {
        populate: ['slug', 'specUrls'],
      },
      apiSoapDetail: {
        populate: ['slug', 'repositoryUrl', 'dirName'],
      },
      icon: { populate: '*' },
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

export const fetchApiDataList = (locale: string) =>
  fetchFromStrapi<ApiDataList>('apis-data', makeStrapiApiDataListPopulate())(
    locale,
    buildEnv
  );
