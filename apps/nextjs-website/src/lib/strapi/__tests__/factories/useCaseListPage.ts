import { strapiTutorialListPages } from '../fixtures/tutorialListPage';
import { StrapiUseCaseListPages } from '@/lib/strapi/types/useCaseListPage';

export function minimalUseCaseListPages(): StrapiUseCaseListPages {
  return {
    data: [
      {
        id: 1,
        attributes: {
          title: 'Minimal Use Cases',
          description: '',
          bannerLinks: [],
          product: {
            data: {
              attributes: {
                ...strapiTutorialListPages.data[0].attributes.product.data!
                  .attributes,
                bannerLinks: [],
              },
            },
          },
          useCases: {
            data: [],
          },
          seo: undefined,
          enableFilters: undefined,
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
}

export function useCaseListPagesWithItemMissingBannerLinks(): StrapiUseCaseListPages {
  return {
    data: [
      {
        id: 1,
        attributes: {
          title: 'No Banner Tutorials',
          description: 'No banner links',
          bannerLinks: [],
          product: minimalUseCaseListPages().data[0].attributes.product,
          useCases: {
            data: [],
          },
          seo: undefined,
          enableFilters: true,
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
