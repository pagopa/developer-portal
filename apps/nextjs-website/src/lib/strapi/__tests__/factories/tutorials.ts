/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiTutorials } from '@/lib/strapi/__tests__/fixtures/tutorials';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';

export function tutorialsWithAnItemMissingSlug(): StrapiTutorials {
  return {
    ...strapiTutorials,
    data: [
      {
        ...strapiTutorials.data[0],
        title: 'Tutorial Without Slug',
        slug: undefined as any,
      },
      {
        ...strapiTutorials.data[0],
        title: 'Valid Tutorial',
        slug: 'valid-tutorial',
      },
    ],
  };
}

export function tutorialsWithAnItemMissingProductSlug(): StrapiTutorials {
  return {
    ...strapiTutorials,
    data: [
      {
        ...strapiTutorials.data[0],
        title: 'Tutorial Without Product Slug',
        slug: 'tutorial-without-product-slug',
        product: {
          ...strapiTutorials.data[0].product!,
          name: 'Product Without Slug',
          slug: undefined as any,
        },
      },
      {
        ...strapiTutorials.data[0],
        title: 'Valid Tutorial',
        slug: 'valid-tutorial',
        product: {
          ...strapiTutorials.data[0].product!,
          name: 'Valid Product',
          slug: 'valid-product',
        },
      },
    ],
  };
}

export function minimalDataTutorials() {
  const strapiTutorial = strapiTutorials.data[0];
  return {
    ...strapiTutorials,
    data: [
      {
        ...strapiTutorial,
        title: 'Minimal Data Tutorial',
        slug: 'minimal-data-tutorial',
        publishedAt: '2023-01-01T00:00:00Z',
        locale: 'en-US',
        parts: [],
        relatedLinks: undefined,
        seo: undefined,
        image: undefined,
      },
    ],
  } satisfies StrapiTutorials;
}

export function tutorialsWithItemMissingData() {
  const strapiTutorial = strapiTutorials.data[0];
  return {
    data: [
      {
        ...strapiTutorial,
        title: undefined,
        slug: undefined,
        publishedAt: undefined,
        locale: undefined,
      },
    ],
  };
}

export function tutorialsWithItemMissingMandatoryData() {
  const strapiTutorial = tutorialsWithItemMissingData().data[0];
  return {
    ...strapiTutorials,
    ...[
      {
        ...strapiTutorial,
        product: undefined,
      },
    ],
  };
}
