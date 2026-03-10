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
    attributes: {
      isVisible: true,
      name: 'Test Product',
      shortName: 'TP',
      slug: 'test-product',
    },
  };
}

export function baseProductWithBannerLinks(): StrapiBaseProductWithBannerLinks {
  return {
    attributes: {
      ...baseProduct().attributes,
      bannerLinks: generateBannerLinks(2),
    },
  };
}

export function baseProductWithoutBannerLinks(): StrapiBaseProductWithoutBannerLinks {
  return {
    attributes: {
      ...baseProduct().attributes,
      description: 'Test product description',
      logo: {
        data: mediaJpeg(),
      },
    },
  };
}

export function baseProductWithoutBannerLinksMinimal(): StrapiBaseProductWithoutBannerLinks {
  return {
    attributes: {
      ...baseProduct().attributes,
      description: undefined,
      logo: {
        data: undefined,
      },
    },
  };
}

export function strapiBaseProductWithRelations(): StrapiBaseProductWithRelations {
  return {
    attributes: {
      tags: { data: [] },
      ...baseProduct().attributes,
      bannerLinks: generateBannerLinks(1),
      overview: { data: { id: 1 } },
      quickstart_guide: { data: { id: 2 } },
      api_data_list_page: { data: undefined },
      tutorial_list_page: { data: { id: 3 } },
      guide_list_page: { data: { id: 4 } },
      release_note: { data: undefined },
      use_case_list_page: { data: { id: 1 } },
    },
  };
}

export function strapiBaseProductWithoutRelations(): StrapiBaseProductWithRelations {
  return {
    attributes: {
      ...baseProduct().attributes,
      bannerLinks: undefined,
      tags: { data: [] },
      overview: { data: undefined },
      quickstart_guide: { data: undefined },
      api_data_list_page: { data: undefined },
      tutorial_list_page: { data: undefined },
      guide_list_page: { data: undefined },
      release_note: { data: undefined },
      use_case_list_page: { data: undefined },
    },
  };
}

export function strapiProduct(): StrapiProduct {
  return {
    attributes: {
      ...baseProduct().attributes,
      tags: { data: [] },
      bannerLinks: generateBannerLinks(2),
      description: 'Complete product description',
      logo: {
        data: mediaJpeg(),
      },
      overview: { data: { id: 1 } },
      quickstart_guide: { data: { id: 2 } },
      api_data_list_page: { data: undefined },
      tutorial_list_page: { data: { id: 3 } },
      guide_list_page: { data: { id: 4 } },
      release_note: { data: { id: 5 } },
      use_case_list_page: { data: { id: 1 } },
    },
  };
}

export function strapiProductMinimal(): StrapiProduct {
  return {
    attributes: {
      ...baseProduct().attributes,
      bannerLinks: undefined,
      description: undefined,
      logo: {
        data: mediaJpeg(),
      },
      tags: { data: [] },
      overview: { data: undefined },
      quickstart_guide: { data: undefined },
      api_data_list_page: { data: undefined },
      tutorial_list_page: { data: undefined },
      guide_list_page: { data: undefined },
      release_note: { data: undefined },
      use_case_list_page: { data: undefined },
    },
  };
}

export function strapiProductWithoutLogo(): StrapiProduct {
  return {
    attributes: {
      ...strapiProduct().attributes,
      logo: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: null as any, // Simulating missing logo data
      },
    },
  };
}

export function productWithAllRelations(): StrapiProduct {
  return {
    attributes: {
      isVisible: true,
      name: 'Full Feature Product',
      shortName: 'FFP',
      tags: { data: [] },
      slug: 'full-feature-product',
      bannerLinks: generateBannerLinks(3),
      description: 'A product with all available relations and features',
      logo: {
        data: mediaJpeg(),
      },
      overview: { data: { id: 1 } },
      quickstart_guide: { data: { id: 2 } },
      api_data_list_page: {
        data: {
          id: 10,
          attributes: {
            updatedAt: '2026-01-01T00:00:00.000Z',
            apiData: {
              data: [
                {
                  attributes: {
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
                },
              ],
            },
          },
        },
      },
      tutorial_list_page: { data: { id: 3 } },
      guide_list_page: { data: { id: 4 } },
      release_note: { data: { id: 5 } },
      use_case_list_page: { data: { id: 1 } },
    },
  };
}

export function productWithMissingMandatoryFields(): Partial<StrapiProduct> {
  return {
    attributes: {
      isVisible: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: undefined as any,
      tags: { data: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shortName: undefined as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      slug: undefined as any,
      bannerLinks: [],
      description: 'Product with missing mandatory fields',
      logo: {
        data: mediaJpeg(),
      },
      overview: { data: undefined },
      quickstart_guide: { data: undefined },
      api_data_list_page: { data: undefined },
      tutorial_list_page: { data: undefined },
      guide_list_page: { data: undefined },
      release_note: { data: undefined },
      use_case_list_page: { data: undefined },
    },
  };
}
