import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { ReleaseNotesCodec } from '@/lib/strapi/codecs/ReleaseNotesCodec';

const makeStrapiReleaseNotesPopulate = () =>
  qs.stringify({
    populate: {
      bannerLinks: {
        populate: ['icon'],
      },
      product: {
        ...productRelationsPopulate,
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchReleaseNotes = fetchFromStrapi(
  'release-notes',
  makeStrapiReleaseNotesPopulate(),
  ReleaseNotesCodec
);
