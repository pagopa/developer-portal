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

export function releaseNotesWithMissingProduct() {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return {
    ...strapiReleaseNotes,
    data: [
      {
        ...strapiReleaseNote,
        attributes: {
          ...strapiReleaseNote.attributes,
          title: 'Release Note Without Product',
          product: {
            data: undefined as any,
          },
        },
      },
    ],
  } satisfies StrapiReleaseNotes;
}

export function mixedReleaseNotesWithAndWithoutProduct() {
  const validReleaseNote = strapiReleaseNotes.data[0];
  const invalidReleaseNote = releaseNotesWithMissingProduct().data[0];

  return {
    ...strapiReleaseNotes,
    data: [
      validReleaseNote,
      invalidReleaseNote,
      {
        ...validReleaseNote,
        id: 3,
        attributes: {
          ...validReleaseNote.attributes,
          title: 'Another Valid Release Note',
          dirName: 'another-valid-release-note',
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

export function releaseNotesWithCorruptedData() {
  const strapiReleaseNote = strapiReleaseNotes.data[0];
  return {
    ...strapiReleaseNotes,
    data: [
      {
        ...strapiReleaseNote,
        attributes: {
          ...strapiReleaseNote.attributes,
          title: 'Corrupted Release Note',
          product: {
            data: {
              ...strapiReleaseNote.attributes.product.data,
              attributes: null as any, // This will cause an error in makeBaseProductWithoutLogoProps
            },
          },
        },
      },
    ],
  };
}

export function allInvalidReleaseNotes() {
  return {
    ...strapiReleaseNotes,
    data: [
      releaseNotesWithMissingProduct().data[0],
      releaseNotesWithCorruptedData().data[0],
    ],
  };
}
