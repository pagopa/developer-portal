/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiUseCases } from '@/lib/strapi/__tests__/fixtures/useCases';
import { StrapiUseCases } from '@/lib/strapi/types/useCase';

export function useCasesWithAnItemMissingSlug(): StrapiUseCases {
  return {
    ...strapiUseCases,
    data: [
      {
        attributes: {
          ...strapiUseCases.data[0].attributes,
          title: 'UseCase Without Slug',
          slug: undefined as any,
        },
      },
      {
        attributes: {
          ...strapiUseCases.data[0].attributes,
          title: 'Valid UseCase',
          slug: 'valid-use-case',
        },
      },
    ],
  };
}

export function useCasesWithAnItemMissingProductSlug(): StrapiUseCases {
  return {
    ...strapiUseCases,
    data: [
      {
        attributes: {
          ...strapiUseCases.data[0].attributes,
          title: 'UseCase Without Product Slug',
          slug: 'use-case-without-product-slug',
          product: {
            data: {
              attributes: {
                ...strapiUseCases.data[0].attributes.product.data.attributes,
                name: 'Product Without Slug',
                slug: undefined as any,
              },
            },
          },
        },
      },
      {
        attributes: {
          ...strapiUseCases.data[0].attributes,
          title: 'Valid UseCase',
          slug: 'valid-use-case',
          product: {
            data: {
              attributes: {
                ...strapiUseCases.data[0].attributes.product.data.attributes,
                name: 'Valid Product',
                slug: 'valid-product',
              },
            },
          },
        },
      },
    ],
  };
}

export function minimalDataUseCases() {
  const strapiUseCase = strapiUseCases.data[0];
  return {
    ...strapiUseCases,
    data: [
      {
        attributes: {
          ...strapiUseCase.attributes,
          title: 'Minimal Data UseCase',
          slug: 'minimal-data-use-case',
          publishedAt: '2023-01-01T00:00:00Z',
          locale: 'en-US',
          parts: [],
          relatedLinks: undefined,
          seo: undefined,
          image: { data: undefined },
        },
      },
    ],
  } satisfies StrapiUseCases;
}

export function useCasesWithItemMissingData() {
  const strapiUseCase = strapiUseCases.data[0];
  return {
    strapiUseCases,
    data: [
      {
        attributes: {
          ...strapiUseCase.attributes,
          title: undefined,
          slug: undefined,
          publishedAt: undefined,
          locale: undefined,
        },
      },
    ],
  };
}

export function useCasesWithItemMissingMandatoryData() {
  const useCase = useCasesWithItemMissingData().data[0];
  return {
    ...strapiUseCases,
    data: [
      {
        ...useCase,
        attributes: {
          ...useCase.attributes,
          product: { data: undefined },
        },
      },
    ],
  };
}
