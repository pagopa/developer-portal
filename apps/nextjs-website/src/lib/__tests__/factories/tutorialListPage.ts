import { StrapiTutorialListPages } from '@/lib/tutorialListPage/types';
import { strapiTutorialListPages } from '@/lib/__tests__/fixtures/tutorialListPage';

export function minimalTutorialListPages(): StrapiTutorialListPages {
  return {
    data: [
      {
        id: 1,
        title: 'Minimal Tutorials',
        description: '',
        bannerLinks: [],
        product: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
