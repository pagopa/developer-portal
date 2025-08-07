import { strapiTutorials } from '@/lib/strapi/__tests__/fixtures/tutorials';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';

export function minimalDataTutorials() {
  const strapiTutorial = strapiTutorials.data[0];
  return {
    ...strapiTutorials,
    data: [
      {
        attributes: {
          ...strapiTutorial.attributes,
          title: 'Minimal Data Tutorial',
          slug: 'minimal-data-tutorial',
          publishedAt: '2023-01-01T00:00:00Z',
          locale: 'en-US',
          parts: [],
          relatedLinks: undefined,
          seo: undefined,
        },
      },
    ],
  } satisfies StrapiTutorials;
}

export function tutorialsWithMissingData() {
  const strapiTutorial = strapiTutorials.data[0];
  return {
    strapiTutorials,
    data: [
      {
        attributes: {
          ...strapiTutorial.attributes,
          title: undefined,
          slug: undefined,
          publishedAt: undefined,
          locale: undefined,
        },
      },
    ],
  };
}

export function tutorialWithMissingMandatoryData() {
  const strapiTutorial = tutorialsWithMissingData().data[0];
  return {
    ...strapiTutorials,
    data: [
      {
        ...strapiTutorial,
        attributes: {
          ...strapiTutorial.attributes,
          product: { data: undefined },
        },
      },
    ],
  };
}
