import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { ApiDataList } from '@/lib/apiDataList/types';

const makeStrapiApiDataListPopulate = () =>
  qs.stringify({
    populate: {
      apiRestDetail: {
        populate: ['specUrls'],
      },
      apiSoapDetail: {
        populate: '*',
      },
      icon: { populate: '*' },
      product: {
        ...productRelationsPopulate,
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*',
      },
    },
  });

// This endpoint does not respect the naming convention but we keep it
// for backward compatibility with the already existing content in Strapi's production instance
export const fetchApiDataList = fetchFromStrapi<ApiDataList>(
  'apis-data',
  makeStrapiApiDataListPopulate()
);
