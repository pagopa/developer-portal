import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from '@/lib/strapi/fetches/fetchProducts';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const releaseNotesPopulate = {
  populate: {
    bannerLinks: {
      populate: ['icon'],
    },
    product: {
      ...productRelationsPopulate,
    },
    seo: {
      populate: '*',
    },
  },
};

const makeStrapiReleaseNotesPopulate = () =>
  qs.stringify({
    ...releaseNotesPopulate,
  });

export const fetchReleaseNotes = fetchFromStrapi<StrapiReleaseNotes>(
  'release-notes',
  makeStrapiReleaseNotesPopulate()
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
  fetchFromStrapi<RootEntity<StrapiReleaseNotes>>(
    'release-notes',
    makeStrapiReleaseNotePopulate(productSlug)
  );
