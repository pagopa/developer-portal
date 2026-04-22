import qs from 'qs';
import { RootEntity } from '@/lib/strapi/types/rootEntity';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiUrlReplaceMap } from './types';

const makeStrapiUrlReplaceMapPopulate = () =>
  qs.stringify({
    populate: {
      urlToGuide: {
        populate: {
          guide: {
            populate: ['product'],
          },
        },
      },
    },
  });

export const fetchUrlReplaceMap = fetchFromStrapi<
  RootEntity<StrapiUrlReplaceMap>
>('url-replace-map', makeStrapiUrlReplaceMapPopulate());
