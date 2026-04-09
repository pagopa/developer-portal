import { StrapiUseCaseListPages } from '@/lib/useCaseListPage/types';
import { strapiUseCaseListPages } from '@/lib/useCaseListPage/__tests__/fixtures';

export function minimalUseCaseListPages(): StrapiUseCaseListPages {
  return {
    data: [
      {
        id: 1,
        title: 'Minimal Use Cases',
        description: '',
        bannerLinks: [],
        product: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...strapiUseCaseListPages.data[0].product!,
          bannerLinks: [],
        },
        useCases: [],
        seo: undefined,
        enableFilters: undefined,
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

export function useCaseListPagesWithItemMissingBannerLinks(): StrapiUseCaseListPages {
  return {
    data: [
      {
        id: 1,
        title: 'No Banner Tutorials',
        description: 'No banner links',
        bannerLinks: [],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        product: minimalUseCaseListPages().data[0]!.product,
        useCases: [],
        seo: undefined,
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
}

export function emptyUseCaseListPages(): StrapiUseCaseListPages {
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
