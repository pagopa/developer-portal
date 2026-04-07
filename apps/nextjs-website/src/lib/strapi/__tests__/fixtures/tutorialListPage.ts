import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '../factories/media';

const fixedDateIsoString = new Date('2025-01-01T00:00:00.000Z').toISOString();

export const strapiTutorialListPages: StrapiTutorialListPages = {
  data: [
    {
      id: 1,
      title: 'Tutorials',
      description: 'Explore our tutorials',
      bannerLinks: generateBannerLinks(1),
      product: {
        isVisible: true,
        tags: [],
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
      },
      tutorials: [
        {
          updatedAt: '2023-01-01T00:00:00.000Z',
          description: '',
          icon: mediaJpeg(),
          tags: [],
          title: 'Tutorial 1',
          slug: 'tutorial-1',
          publishedAt: fixedDateIsoString,
          product: {
            isVisible: true,
            name: 'Product 1',
            shortName: 'P1',
            slug: 'product-1',
          },
          image: mediaJpeg(),
        },
      ],
      seo: {
        metaTitle: 'Tutorials SEO Title',
        metaDescription: 'Tutorials SEO Description',
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
