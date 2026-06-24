import type {
  StrapiBaseProduct,
  StrapiBaseProductWithBannerLinks,
  StrapiBaseProductWithoutBannerLinks,
  StrapiBaseProductWithRelations,
  StrapiProduct,
} from '@/lib/products/strapiTypes';
import { mediaJpeg } from '@/lib/media/__tests__/factories';
import { generateBannerLinks } from '@/lib/bannerLink/__tests__/factories';
import { strapiProducts } from '@/lib/products/__tests__/fixtures';

export function baseProduct(): StrapiBaseProduct {
  return {
    isVisible: true,
    name: 'Test Product',
    shortName: 'TP',
    slug: 'test-product',
  };
}

export function baseProductWithBannerLinks(): StrapiBaseProductWithBannerLinks {
  return {
    ...baseProduct(),
    bannerLinks: generateBannerLinks(2),
  };
}

export function baseProductWithoutBannerLinks(): StrapiBaseProductWithoutBannerLinks {
  return {
    ...baseProduct(),
    description: 'Test product description',
    logo: mediaJpeg(),
  };
}

export function baseProductWithoutBannerLinksMinimal(): StrapiBaseProductWithoutBannerLinks {
  return {
    ...baseProduct(),
    description: undefined,
    logo: undefined,
  };
}

export function strapiBaseProductWithRelations(): StrapiBaseProductWithRelations {
  return {
    tags: [],
    ...baseProduct(),
    bannerLinks: generateBannerLinks(1),
    overview: 1,
    quickstart_guide: 2,
    api_data_list_page: undefined,
    tutorial_list_page: 3,
    guide_list_page: 4,
    release_note: undefined,
    use_case_list_page: 1,
  };
}

export function strapiBaseProductWithoutRelations(): StrapiBaseProductWithRelations {
  return {
    ...baseProduct(),
    bannerLinks: undefined,
    tags: [],
    overview: undefined,
    quickstart_guide: undefined,
    api_data_list_page: undefined,
    tutorial_list_page: undefined,
    guide_list_page: undefined,
    release_note: undefined,
    use_case_list_page: undefined,
  };
}

export function strapiProduct(): StrapiProduct {
  return {
    ...baseProduct(),
    tags: [],
    bannerLinks: generateBannerLinks(2),
    description: 'Complete product description',
    logo: mediaJpeg(),
    overview: 1,
    quickstart_guide: 2,
    api_data_list_page: undefined,
    tutorial_list_page: 3,
    guide_list_page: 4,
    release_note: 5,
    use_case_list_page: 1,
  };
}

export function strapiProductMinimal(): StrapiProduct {
  return {
    ...baseProduct(),
    bannerLinks: undefined,
    description: undefined,
    logo: mediaJpeg(),
    tags: [],
    overview: undefined,
    quickstart_guide: undefined,
    api_data_list_page: undefined,
    tutorial_list_page: undefined,
    guide_list_page: undefined,
    release_note: undefined,
    use_case_list_page: undefined,
  };
}

export function strapiProductWithoutLogo(): StrapiProduct {
  return {
    ...strapiProduct(),
    logo: undefined,
  };
}

export function productWithAllRelations(): StrapiProduct {
  return {
    isVisible: true,
    name: 'Full Feature Product',
    shortName: 'FFP',
    tags: [],
    slug: 'full-feature-product',
    bannerLinks: generateBannerLinks(3),
    description: 'A product with all available relations and features',
    logo: mediaJpeg(),
    overview: 1,
    quickstart_guide: 2,
    api_data_list_page: {
      id: 10,
      updatedAt: '2026-01-01T00:00:00.000Z',
      api_data: [
        {
          apiRestDetail: {
            slug: 'test-api',
            specUrls: [
              {
                id: 0,
                name: 'Spec URL',
                url: 'https://example.com/api/spec.yaml',
                hideTryIt: false,
              },
            ],
          },
        },
      ],
    },
    tutorial_list_page: 3,
    guide_list_page: 4,
    release_note: 5,
    use_case_list_page: 1,
  };
}

export function productWithMissingMandatoryFields(): Partial<StrapiProduct> {
  return {
    isVisible: true,
    name: undefined as unknown as string,
    tags: [],
    shortName: undefined as unknown as string,
    slug: undefined as unknown as string,
    bannerLinks: [],
    description: 'Product with missing mandatory fields',
    logo: mediaJpeg(),
    overview: undefined,
    quickstart_guide: undefined,
    api_data_list_page: undefined,
    tutorial_list_page: undefined,
    guide_list_page: undefined,
    release_note: undefined,
    use_case_list_page: undefined,
  };
}

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
      slug: undefined as unknown as string,
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
  ];
}

export function productWithEmptyApiData(): readonly StrapiProduct[] {
  const strapiProduct = strapiProducts.data[0];
  return [
    {
      ...strapiProduct,
      api_data_list_page: {
        id: 1,
        updatedAt: '2026-01-01T00:00:00.000Z',
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
      api_data_list_page:
        'corrupted api data' as unknown as StrapiProduct['api_data_list_page'],
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
