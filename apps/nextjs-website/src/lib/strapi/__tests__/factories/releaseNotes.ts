/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiReleaseNotes } from '@/lib/strapi/__tests__/fixtures/releaseNotes';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';

export function minimalDataReleaseNotes() {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return {
    ...strapiReleaseNotes,
    data: [
      {
        ...strapiReleaseNote,
        attributes: {
          ...strapiReleaseNote.attributes,
          title: 'Minimal Release Notes',
          dirName: 'minimal-release-notes',
          landingFile: 'minimal.md',
          bannerLinks: [],
          seo: undefined,
          product: {
            data: {
              ...strapiReleaseNote.attributes.product.data,
              attributes: {
                ...strapiReleaseNote.attributes.product.data.attributes,
                bannerLinks: undefined,
              },
            },
          },
        },
      },
    ],
  } satisfies StrapiReleaseNotes;
}

export function releaseNotesWithoutBannerLinks() {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return {
    ...strapiReleaseNotes,
    data: [
      {
        ...strapiReleaseNote,
        attributes: {
          ...strapiReleaseNote.attributes,
          bannerLinks: [],
        },
      },
    ],
  } satisfies StrapiReleaseNotes;
}

export function releaseNotesWithoutProductBannerLinks() {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return {
    ...strapiReleaseNotes,
    data: [
      {
        ...strapiReleaseNote,
        attributes: {
          ...strapiReleaseNote.attributes,
          bannerLinks: [],
          product: {
            data: {
              ...strapiReleaseNote.attributes.product.data,
              attributes: {
                ...strapiReleaseNote.attributes.product.data.attributes,
                bannerLinks: [],
              },
            },
          },
        },
      },
    ],
  } satisfies StrapiReleaseNotes;
}

export function releaseNotesWithMissingProductSlug() {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return {
    ...strapiReleaseNotes,
    data: [
      {
        ...strapiReleaseNote,
        attributes: {
          ...strapiReleaseNote.attributes,
          title: 'Release Note Without Product Slug',
          product: {
            data: {
              ...strapiReleaseNote.attributes.product.data,
              attributes: {
                ...strapiReleaseNote.attributes.product.data.attributes,
                slug: undefined as any,
              },
            },
          },
        },
      },
    ],
  } satisfies StrapiReleaseNotes;
}
