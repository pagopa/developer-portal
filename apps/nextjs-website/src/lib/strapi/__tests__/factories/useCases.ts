/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiUseCases } from '@/lib/strapi/__tests__/fixtures/useCases';
import { StrapiUseCases } from '@/lib/strapi/types/useCase';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function useCasesWithAnItemMissingSlug(): StrapiUseCases {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiUseCases.data[0],
      title: 'UseCase Without Slug',
      slug: undefined as any,
    },
    {
      ...strapiUseCases.data[0],
      title: 'Valid UseCase',
      slug: 'valid-use-case',
    },
  ]) as StrapiUseCases;
}

export function useCasesWithAnItemMissingProductSlug(): StrapiUseCases {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiUseCases.data[0],
      title: 'UseCase Without Product Slug',
      slug: 'use-case-without-product-slug',
      product: {
        ...strapiUseCases.data[0].product!,
        name: 'Product Without Slug',
        slug: undefined as any,
      },
    },
    {
      ...strapiUseCases.data[0],
      title: 'Valid UseCase',
      slug: 'valid-use-case',
      product: {
        ...strapiUseCases.data[0].product!,
        name: 'Valid Product',
        slug: 'valid-product',
      },
    },
  ]) as StrapiUseCases;
}

export function minimalDataUseCases() {
  const strapiUseCase = strapiUseCases.data[0];
  return wrapAsPaginatedRootEntity([
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
  ]) as StrapiUseCases;
}

export function useCasesWithItemMissingData() {
  const strapiUseCase = strapiUseCases.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiUseCase,
      title: undefined,
      slug: undefined,
      publishedAt: undefined,
      locale: undefined,
    },
  ]);
}

export function useCasesWithItemMissingMandatoryData() {
  const useCase = (useCasesWithItemMissingData() as any).data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...useCase,
      product: undefined,
    },
  ]);
}
