/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiProducts } from '@/lib/strapi/__tests__/fixtures/products';
import { StrapiProducts } from '@/lib/strapi/types/product';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalProduct(): StrapiProducts {
  const strapiProduct = strapiProducts.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiProduct,
      name: 'Minimal Product',
      slug: 'minimal-product',
      shortName: 'MP',
      description: undefined,
      logo: strapiProduct.logo,
      bannerLinks: [],
      overview: undefined,
      quickstart_guide: undefined,
      api_data_list_page: undefined,
      guide_list_page: undefined,
      tutorial_list_page: undefined,
      release_note: undefined,
      use_case_list_page: undefined,
    },
  ]);
}

export function productsWithAnItemWithEmptySlug(): StrapiProducts {
  const strapiProduct = strapiProducts.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiProduct,
      name: 'Product Without Slug',
      slug: '',
    },
  ]);
}

export function productsWithAnItemMissingSlug(): StrapiProducts {
  const strapiProduct = strapiProducts.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiProduct,
      name: 'Product Without Slug',
      slug: undefined as any,
    },
  ]);
}

export function productWithMultipleApiData(): StrapiProducts {
  const strapiProduct = strapiProducts.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiProduct,
      api_data_list_page: {
        id: 1,
        updatedAt: '2026-01-01T00:00:00.000Z',
        api_data: [
          {
            apiRestDetail: {
              slug: 'api-detail-1',
              specUrls: [],
            },
          },
          {
            apiRestDetail: {
              slug: 'api-detail-2',
              specUrls: [],
            },
          },
        ],
      },
    },
  ]);
}

export function productWithEmptyApiData(): StrapiProducts {
  const strapiProduct = strapiProducts.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiProduct,
      api_data_list_page: {
        id: 1,
        updatedAt: '2026-01-01T00:00:00.000Z',
        api_data: [],
      },
    },
  ]);
}

export function productWithCorruptedData(): StrapiProducts {
  const strapiProduct = strapiProducts.data[0];
  return wrapAsPaginatedRootEntity([
    {
      ...strapiProduct,
      api_data_list_page: 'corrupted api data' as any,
      name: 'Corrupted Product',
    },
  ]);
}

export function mixedValidAndInvalidProducts(): StrapiProducts {
  const validProduct = strapiProducts.data[0];
  const invalidProduct = productsWithAnItemMissingSlug().data[0];
  return wrapAsPaginatedRootEntity([
    validProduct,
    invalidProduct,
    {
      ...validProduct,
      name: 'Another Valid Product',
      slug: 'another-valid-product',
    },
  ]);
}

export function allInvalidProducts(): StrapiProducts {
  return wrapAsPaginatedRootEntity([
    productsWithAnItemMissingSlug().data[0],
    productWithCorruptedData().data[0],
  ]);
}
