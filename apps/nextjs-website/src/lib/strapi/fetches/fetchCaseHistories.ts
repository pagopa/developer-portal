import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

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
        populate: '*',
      },
    },
  });

export const fetchCaseHistories = fetchFromStrapi<
  RootEntity<StrapiCaseHistories>
>('case-histories', makeStrapiCaseHistoriesPopulate());
