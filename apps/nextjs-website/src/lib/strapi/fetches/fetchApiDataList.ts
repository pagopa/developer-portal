import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { ApiDataListCodec } from '@/lib/strapi/codecs/ApiDataListCodec';
import { productRelationsPopulate } from './fetchProducts';

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

// This endpoint does not respect the naming convention but we keep it
// for backward compatibility with the already existing content in Strapi's production instance
export const fetchApiDataList = fetchFromStrapi(
  'apis-data',
  makeStrapiApiDataListPopulate(),
  ApiDataListCodec
);
