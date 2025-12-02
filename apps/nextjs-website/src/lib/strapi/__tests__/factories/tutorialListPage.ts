import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import { strapiTutorialListPages } from '../fixtures/tutorialListPage';

export function minimalTutorialListPages(): StrapiTutorialListPages {
  return {
    data: [
      {
        id: 1,
        title: 'Minimal Tutorials',
        description: '',
        bannerLinks: [],
        product: {
          ...strapiTutorialListPages.data[0].product!,
          bannerLinks: [],
        },
        tutorials: [],
        seo: undefined,
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
}

export function tutorialListPagesWithItemMissingBannerLinks(): StrapiTutorialListPages {
  return {
    data: [
      {
        id: 1,
        title: 'No Banner Tutorials',
        description: 'No banner links',
        bannerLinks: [],
        product: minimalTutorialListPages().data[0]!.product,
        tutorials: [],
        seo: undefined,
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
}

export function emptyTutorialListPages(): StrapiTutorialListPages {
  return {
    data: [],
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 0,
        total: 0,
      },
    },
  };
}
