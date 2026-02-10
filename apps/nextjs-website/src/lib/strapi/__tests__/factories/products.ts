/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiProducts } from '@/lib/strapi/__tests__/fixtures/products';
import { StrapiProduct } from '@/lib/strapi/types/product';

export function minimalProduct(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
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
  ];
}

export function productsWithAnItemWithEmptySlug(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
    {
      ...strapiProduct,
      name: 'Product Without Slug',
      slug: '',
    },
  ];
}

export function productsWithAnItemMissingSlug(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
    {
      ...strapiProduct,
      name: 'Product Without Slug',
      slug: undefined as any,
    },
  ];
}

export function productWithMultipleApiData(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
    {
      ...strapiProduct,
      api_data_list_page: {
        id: 1,
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
  ];
}

export function productWithEmptyApiData(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
    {
      ...strapiProduct,
      api_data_list_page: {
        id: 1,
        api_data: [],
      },
    },
  ];
}

export function productWithCorruptedData(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
    {
      ...strapiProduct,
      api_data_list_page: 'corrupted api data' as any,
      name: 'Corrupted Product',
    },
  ];
}

export function mixedValidAndInvalidProducts(): readonly StrapiProduct[] {
  const validProduct = strapiProducts.data[0];
  const invalidProduct = productsWithAnItemMissingSlug()[0];
  return [
    validProduct,
    invalidProduct,
    {
      ...validProduct,
      name: 'Another Valid Product',
      slug: 'another-valid-product',
    },
  ];
}

export function allInvalidProducts(): readonly StrapiProduct[] {
  return [productsWithAnItemMissingSlug()[0], productWithCorruptedData()[0]];
}
