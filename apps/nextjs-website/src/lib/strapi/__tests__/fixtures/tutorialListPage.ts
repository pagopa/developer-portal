import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '../factories/media';

const fixedDateIsoString = new Date('2025-01-01T00:00:00.000Z').toISOString();

export const strapiTutorialListPages: StrapiTutorialListPages = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'Tutorials',
        description: 'Explore our tutorials',
        locale: 'it',
        updatedAt: fixedDateIsoString,
        bannerLinks: generateBannerLinks(1),
        product: {
          data: {
            attributes: {
              isVisible: true,
              tags: { data: [] },
              name: 'Product 1',
              shortName: 'P1',
              slug: 'product-1',
              locale: 'it',
              updatedAt: fixedDateIsoString,
              bannerLinks: generateBannerLinks(1),
              overview: { data: undefined },
              quickstart_guide: { data: undefined },
              api_data_list_page: { data: undefined },
              tutorial_list_page: { data: undefined },
              guide_list_page: { data: undefined },
              release_note: { data: undefined },
              use_case_list_page: { data: undefined },
            },
          },
        },
        tutorials: {
          data: [
            {
              attributes: {
                updatedAt: '2023-01-01T00:00:00.000Z',
                description: '',
                icon: { data: mediaJpeg() },
                tags: { data: [] },
                title: 'Tutorial 1',
                slug: 'tutorial-1',
                locale: 'it',
                publishedAt: fixedDateIsoString,
                product: {
                  data: {
                    attributes: {
                      isVisible: true,
                      name: 'Product 1',
                      shortName: 'P1',
                      slug: 'product-1',
                      locale: 'it',
                      updatedAt: fixedDateIsoString,
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
          metaTitle: 'Tutorials SEO Title',
          metaDescription: 'Tutorials SEO Description',
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
