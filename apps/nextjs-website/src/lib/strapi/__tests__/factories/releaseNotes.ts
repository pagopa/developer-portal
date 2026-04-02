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
        title: 'Minimal Release Notes',
        dirName: 'minimal-release-notes',
        landingFile: 'minimal.md',
        bannerLinks: [],
        seo: undefined,
        product: {
          ...strapiReleaseNote.product!,
          bannerLinks: undefined,
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
        bannerLinks: [],
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
        bannerLinks: [],
        product: {
          ...strapiReleaseNote.product!,
          bannerLinks: [],
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
        title: 'Release Note Without Product Slug',
        product: {
          ...strapiReleaseNote.product!,
          slug: undefined as any,
        },
      },
    ],
  } satisfies StrapiReleaseNotes;
}
