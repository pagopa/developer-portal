import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/products/fetcher';
import { fetchCollectionFromStrapi } from '@/lib/strapi/fetchFromStrapi.helpers';
import { buildEnv } from '@/lib/buildEnv';
import { ApiDataList, SitemapApiData as ProductApiData } from './types';

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

export const fetchApiDataList = (locale: string) =>
  fetchFromStrapi<ApiDataList>('apis-data', makeStrapiApiDataListPopulate())(
    locale,
    buildEnv
  );

export const fetchProductApiData = (locale: string, productSlug: string) =>
  fetchCollectionFromStrapi<ProductApiData>('apis-data', productSlug, {
    fields: ['updatedAt'],
    populate: {
      apiRestDetail: { fields: ['slug'] },
      apiSoapDetail: { fields: ['slug'] },
    },
  })(locale, buildEnv);
