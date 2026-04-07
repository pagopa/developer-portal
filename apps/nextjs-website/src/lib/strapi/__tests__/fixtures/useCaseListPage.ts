import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { StrapiUseCaseListPages } from '@/lib/strapi/types/useCaseListPage';

const fixedDateIsoString = new Date('2025-01-01T00:00:00.000Z').toISOString();

export const strapiUseCaseListPages: StrapiUseCaseListPages = {
  data: [
    {
      id: 1,
      title: 'Use Cases',
      description: 'Explore our use cases',
      bannerLinks: generateBannerLinks(1),
      product: {
        isVisible: true,
        name: 'Product 1',
        shortName: 'P1',
        slug: 'product-1',
        bannerLinks: generateBannerLinks(1),
        overview: undefined,
        quickstart_guide: undefined,
        api_data_list_page: undefined,
        tutorial_list_page: undefined,
        guide_list_page: undefined,
        release_note: undefined,
        use_case_list_page: undefined,
        tags: [],
      },
      useCases: [
        {
          title: 'Use Case 1',
          slug: 'use-case-1',
          publishedAt: fixedDateIsoString,
          product: {
            isVisible: true,
            name: 'Product 1',
            shortName: 'P1',
            slug: 'product-1',
          },
          coverImage: mediaJpeg(),
          tags: [
            {
              name: 'Tag1',
              icon: mediaJpeg(),
            },
          ],
        },
      ],
      seo: {
        metaTitle: 'Use Cases SEO Title',
        metaDescription: 'Use Cases SEO Description',
      },
      enableFilters: true,
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
};
