import * as qs from 'qs';
import { deprecatedFetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
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

export const fetchReleaseNotes = deprecatedFetchFromStrapi(
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
  deprecatedFetchFromStrapi(
    'release-notes',
    makeStrapiReleaseNotePopulate(productSlug),
    ReleaseNotesCodec
  );
