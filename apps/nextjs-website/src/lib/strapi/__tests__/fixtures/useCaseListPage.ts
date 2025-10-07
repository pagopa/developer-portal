import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { StrapiUseCaseListPages } from '@/lib/strapi/types/useCaseListPage';

const fixedDateIsoString = new Date('2025-01-01T00:00:00.000Z').toISOString();

export const strapiUseCaseListPages: StrapiUseCaseListPages = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'Use Cases',
        description: 'Explore our use cases',
        bannerLinks: generateBannerLinks(1),
        product: {
          data: {
            attributes: {
              name: 'Product 1',
              shortName: 'P1',
              slug: 'product-1',
              bannerLinks: generateBannerLinks(1),
              overview: { data: undefined },
              quickstart_guide: { data: undefined },
              api_data_list_page: { data: undefined },
              tutorial_list_page: { data: undefined },
              guide_list_page: { data: undefined },
              release_note: { data: undefined },
              use_case_list_page: { data: undefined },
              tags: { data: [] },
            },
          },
        },
        useCases: {
          data: [
            {
              attributes: {
                title: 'Use Case 1',
                slug: 'use-case-1',
                publishedAt: fixedDateIsoString,
                product: {
                  data: {
                    attributes: {
                      name: 'Product 1',
                      shortName: 'P1',
                      slug: 'product-1',
                    },
                  },
                },
                image: {
                  data: mediaJpeg(),
                },
              },
            },
          ],
        },
        seo: {
          metaTitle: 'Use Cases SEO Title',
          metaDescription: 'Use Cases SEO Description',
        },
      },
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
