import { StrapiProducts } from '@/lib/strapi/types/product';
import { Product } from '@/lib/types/product';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';

export const strapiProducts: StrapiProducts = {
  data: [
    {
      attributes: {
        isVisible: true,
        tags: { data: [] },
        name: 'Test Product',
        slug: 'test-product',
        shortName: 'TP',
        description: 'Test product description',
        logo: {
          data: mediaJpeg(),
        },
        bannerLinks: generateBannerLinks(2),
        overview: { data: { id: 1 } },
        quickstart_guide: { data: { id: 1 } },
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
                        slug: 'api-detail',
                        specUrls: [],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        guide_list_page: { data: { id: 1 } },
        tutorial_list_page: { data: { id: 1 } },
        release_note: { data: { id: 1 } },
        use_case_list_page: { data: { id: 1 } },
      },
    },
  ],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
};

export const expectedProduct: Product = {
  isVisible: true,
  name: 'Test Product',
  slug: 'test-product',
  shortName: 'TP',
  description: 'Test product description',
  logo: {
    url: 'https://example.com/example.jpg',
    alternativeText: 'Example Image',
    caption: undefined,
    height: 600,
    name: 'example.jpg',
    ext: '.jpg',
    mime: 'image/jpeg',
    size: 123456,
    width: 800,
  },
  bannerLinks: [
    {
      title: 'Banner Link 1',
      icon: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        caption: undefined,
        height: 600,
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
        width: 800,
      },
      theme: 'light',
    },
    {
      title: 'Banner Link 2',
      icon: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        caption: undefined,
        height: 600,
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
        width: 800,
      },
      theme: 'light',
    },
  ],
  hasApiDataListPage: true,
  apiDataListPageUrl: '/it/test-product/api/api-detail',
  hasTutorialListPage: true,
  hasGuideListPage: true,
  hasOverviewPage: true,
  hasQuickstartGuidePage: true,
  hasReleaseNotePage: true,
  hasUseCaseListPage: true,
};
