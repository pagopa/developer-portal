import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { ReleaseNotesCodec } from '@/lib/strapi/codecs/ReleaseNotesCodec';

const releaseNotesPopulate = {
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
};

const makeStrapiReleaseNotesPopulate = () =>
  qs.stringify({
    ...releaseNotesPopulate,
  });

export const fetchReleaseNotes = fetchFromStrapi(
  'release-notes',
  makeStrapiReleaseNotesPopulate(),
  ReleaseNotesCodec
);

const makeStrapiReleaseNotePopulate = (productSlug: string) =>
  qs.stringify({
    ...releaseNotesPopulate,
    filters: {
      product: {
        slug: productSlug,
      },
    },
  });

export const fetchReleaseNote = (productSlug: string) =>
  fetchFromStrapi(
    'release-notes',
    makeStrapiReleaseNotePopulate(productSlug),
    ReleaseNotesCodec
  );
