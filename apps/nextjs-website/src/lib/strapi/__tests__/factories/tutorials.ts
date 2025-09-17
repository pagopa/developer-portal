/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiTutorials } from '@/lib/strapi/__tests__/fixtures/tutorials';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';

export function tutorialsWithAnItemMissingSlug(): StrapiTutorials {
  return {
    ...strapiTutorials,
    data: [
      {
        attributes: {
          ...strapiTutorials.data[0].attributes,
          title: 'Tutorial Without Slug',
          slug: undefined as any
        }
      },
      {
        attributes: {
          ...strapiTutorials.data[0].attributes,
          title: 'Valid Tutorial',
          slug: 'valid-tutorial'
        }
      }
    ]
  };
}

export function tutorialsWithAnItemMissingProductSlug(): StrapiTutorials {
  return {
    ...strapiTutorials,
    data: [
      {
        attributes: {
          ...strapiTutorials.data[0].attributes,
          title: 'Tutorial Without Product Slug',
          slug: 'tutorial-without-product-slug',
          product: {
            data: {
              attributes: {
                ...strapiTutorials.data[0].attributes.product.data.attributes,
                name: 'Product Without Slug',
                slug: undefined as any
              }
            }
          }
        }
      },
      {
        attributes: {
          ...strapiTutorials.data[0].attributes,
          title: 'Valid Tutorial',
          slug: 'valid-tutorial',
          product: {
            data: {
              attributes: {
                ...strapiTutorials.data[0].attributes.product.data.attributes,
                name: 'Valid Product',
                slug: 'valid-product'
              }
            }
          }
        }
      }
    ]
  };
}

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
          image: { data: undefined }
        }
      }
    ]
  } satisfies StrapiTutorials;
}

export function tutorialsWithItemMissingData() {
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
          locale: undefined
        }
      }
    ]
  };
}

export function tutorialsWithItemMissingMandatoryData() {
  const strapiTutorial = tutorialsWithItemMissingData().data[0];
  return {
    ...strapiTutorials,
    data: [
      {
        ...strapiTutorial,
        attributes: {
          ...strapiTutorial.attributes,
          product: { data: undefined }
        }
      }
    ]
  };
}
