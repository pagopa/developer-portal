import { StrapiQuickStartGuides } from '@/lib/strapi/types/quickStartGuides';
import { alertPart, codeBlockPart } from './parts';

export const strapiQuickStartGuides: StrapiQuickStartGuides = {
  data: [
    {
      id: 1,
      title: 'Quick Start Guide Title',
      description: 'Quick Start Guide Description',
      updatedAt: '2024-01-01T00:00:00.000Z',
      product: {
        isVisible: true,
        tags: [],
        name: 'Product Name',
        shortName: 'Product',
        slug: 'product-slug',
        bannerLinks: [],
        overview: 1,
        quickstart_guide: 1,
        api_data_list_page: undefined,
        tutorial_list_page: 1,
        guide_list_page: 1,
        release_note: 1,
        use_case_list_page: 1,
      },
      bannerLinks: [],
      seo: {
        metaTitle: 'Meta Title',
        metaDescription: 'Meta Description',
      },
      quickstartGuideItems: [
        {
          id: 1,
          title: 'Step 1',
          anchor: 'step-1',
          publishedAt: '2024-01-01T00:00:00.000Z',
          parts: [alertPart, codeBlockPart],
        },
      ],
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
