/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiReleaseNotes } from '@/lib/strapi/__tests__/fixtures/releaseNotes';
import {
  StrapiReleaseNote,
  StrapiReleaseNotes,
} from '@/lib/strapi/types/releaseNotes';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalDataReleaseNotes(): StrapiReleaseNotes {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return wrapAsPaginatedRootEntity([
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
    } as StrapiReleaseNote,
  ]);
}

export function releaseNotesWithoutBannerLinks(): StrapiReleaseNotes {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiReleaseNote,
      bannerLinks: [],
    } as StrapiReleaseNote,
  ]);
}

export function releaseNotesWithoutProductBannerLinks(): StrapiReleaseNotes {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiReleaseNote,
      bannerLinks: [],
      product: {
        ...strapiReleaseNote.product!,
        bannerLinks: [],
      },
    } as StrapiReleaseNote,
  ]);
}

export function releaseNotesWithMissingProductSlug(): StrapiReleaseNotes {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiReleaseNote,
      title: 'Release Note Without Product Slug',
      product: {
        ...strapiReleaseNote.product!,
        slug: undefined as any,
      },
    } as StrapiReleaseNote,
  ]);
}
