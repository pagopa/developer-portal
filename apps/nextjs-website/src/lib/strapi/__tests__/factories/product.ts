import {
  StrapiBaseProduct,
  StrapiBaseProductWithBannerLinks,
  StrapiBaseProductWithoutBannerLinks,
  StrapiBaseProductWithRelations,
  StrapiProduct,
} from '@/lib/strapi/types/product';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';

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
    name: undefined as any,
    tags: [],
    shortName: undefined as any,
    slug: undefined as any,
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
