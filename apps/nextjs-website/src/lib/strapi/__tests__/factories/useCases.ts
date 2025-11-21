/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiUseCases } from '@/lib/strapi/__tests__/fixtures/useCases';
import { StrapiUseCases } from '@/lib/strapi/types/useCase';

export function useCasesWithAnItemMissingSlug(): StrapiUseCases {
  return {
    ...strapiUseCases,
    ...[
      {
        ...strapiUseCases[0],
        title: 'UseCase Without Slug',
        slug: undefined as any,
      },
      {
        ...strapiUseCases[0],
        title: 'Valid UseCase',
        slug: 'valid-use-case',
      },
    ],
  };
}

export function useCasesWithAnItemMissingProductSlug(): StrapiUseCases {
  return {
    ...strapiUseCases,
    ...[
      {
        ...strapiUseCases[0],
        title: 'UseCase Without Product Slug',
        slug: 'use-case-without-product-slug',
        product: {
          ...strapiUseCases[0].product!,
          name: 'Product Without Slug',
          slug: undefined as any,
        },
      },
      {
        ...strapiUseCases[0],
        title: 'Valid UseCase',
        slug: 'valid-use-case',
        product: {
          ...strapiUseCases[0].product!,
          name: 'Valid Product',
          slug: 'valid-product',
        },
      },
    ],
  };
}

export function minimalDataUseCases() {
  const strapiUseCase = strapiUseCases[0];
  return {
    ...strapiUseCases,
    ...[
      {
        ...strapiUseCase,
        title: 'Minimal Data UseCase',
        subtitle: 'Minimal Data UseCase Subtitle',
        slug: 'minimal-data-use-case',
        publishedAt: '2023-01-01T00:00:00Z',
        locale: 'en-US',
        parts: [],
        relatedLinks: undefined,
        seo: undefined,
        coverImage: undefined,
        headerImage: undefined,
      },
    ],
  } satisfies StrapiUseCases;
}

export function useCasesWithItemMissingData() {
  const strapiUseCase = strapiUseCases[0];
  return {
    ...strapiUseCases,
    ...[
      {
        ...strapiUseCase,
        title: undefined,
        slug: undefined,
        publishedAt: undefined,
        locale: undefined,
      },
    ],
  };
}

export function useCasesWithItemMissingMandatoryData() {
  const useCase = useCasesWithItemMissingData()[0];
  return {
    ...strapiUseCases,
    ...[
      {
        ...useCase,
        product: undefined,
      },
    ],
  };
}
