/* eslint-disable @typescript-eslint/no-explicit-any */
import { strapiProducts } from '@/lib/strapi/__tests__/fixtures/products';
import { StrapiProducts } from '@/lib/strapi/types/product';

export function minimalProduct() {
  const strapiProduct = strapiProducts.data[0];
  return {
    ...strapiProducts,
    data: [
      {
        ...strapiProduct,
        attributes: {
          ...strapiProduct.attributes,
          name: 'Minimal Product',
          slug: 'minimal-product',
          shortName: 'MP',
          description: undefined,
          logo: {
            data: strapiProduct.attributes.logo.data,
          },
          bannerLinks: [],
          overview: { data: undefined },
          quickstart_guide: { data: undefined },
          api_data_list_page: { data: undefined },
          guide_list_page: { data: undefined },
          tutorial_list_page: { data: undefined },
          release_note: { data: undefined },
          use_case_list_page: { data: undefined },
        },
      },
    ],
  } satisfies StrapiProducts;
}

export function productsWithAnItemWithEmptySlug() {
  const strapiProduct = strapiProducts.data[0];
  return {
    ...strapiProducts,
    data: [
      {
        ...strapiProduct,
        attributes: {
          ...strapiProduct.attributes,
          name: 'Product Without Slug',
          slug: '',
        },
      },
    ],
  } satisfies StrapiProducts;
}

export function productsWithAnItemMissingSlug() {
  const strapiProduct = strapiProducts.data[0];
  return {
    ...strapiProducts,
    data: [
      {
        ...strapiProduct,
        attributes: {
          ...strapiProduct.attributes,
          name: 'Product Without Slug',
          slug: undefined as any,
        },
      },
    ],
  } satisfies StrapiProducts;
}

export function productWithMultipleApiData() {
  const strapiProduct = strapiProducts.data[0];
  return {
    ...strapiProducts,
    data: [
      {
        ...strapiProduct,
        attributes: {
          ...strapiProduct.attributes,
          api_data_list_page: {
            data: {
              id: 1,
              attributes: {
                updatedAt: '2026-01-01T00:00:00.000Z',
                apiData: {
                  data: [
                    {
                      attributes: {
                        apiRestDetail: {
                          slug: 'api-detail-1',
                          specUrls: [],
                        },
                      },
                    },
                    {
                      attributes: {
                        apiRestDetail: {
                          slug: 'api-detail-2',
                          specUrls: [],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ],
  } satisfies StrapiProducts;
}

export function productWithEmptyApiData() {
  const strapiProduct = strapiProducts.data[0];
  return {
    ...strapiProducts,
    data: [
      {
        ...strapiProduct,
        attributes: {
          ...strapiProduct.attributes,
          api_data_list_page: {
            data: {
              id: 1,
              attributes: {
                updatedAt: '2026-01-01T00:00:00.000Z',
                apiData: {
                  data: [],
                },
              },
            },
          },
        },
      },
    ],
  } satisfies StrapiProducts;
}

export function productWithCorruptedData() {
  const strapiProduct = strapiProducts.data[0];
  return {
    ...strapiProducts,
    data: [
      {
        ...strapiProduct,
        attributes: {
          ...strapiProduct.attributes,
          api_data_list_page: undefined as any,
          name: 'Corrupted Product',
        },
      },
    ],
  };
}

export function mixedValidAndInvalidProducts() {
  const validProduct = strapiProducts.data[0];
  const invalidProduct = productsWithAnItemMissingSlug().data[0];

  return {
    ...strapiProducts,
    data: [
      validProduct,
      invalidProduct,
      {
        ...validProduct,
        attributes: {
          ...validProduct.attributes,
          name: 'Another Valid Product',
          slug: 'another-valid-product',
        },
      },
    ],
  } satisfies StrapiProducts;
}

export function allInvalidProducts() {
  return {
    ...strapiProducts,
    data: [
      productsWithAnItemMissingSlug().data[0],
      productWithCorruptedData().data[0],
    ],
  };
}

export function productWithMissingAttributes() {
  return {
    id: 1,
    attributes: undefined as any,
  };
}
