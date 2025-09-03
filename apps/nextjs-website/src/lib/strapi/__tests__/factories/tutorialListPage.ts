import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import { strapiTutorialListPages } from '../fixtures/tutorialListPage';

export function minimalTutorialListPages(): StrapiTutorialListPages {
  return {
    data: [
      {
        id: 1,
        attributes: {
          title: 'Minimal Tutorials',
          description: '',
          bannerLinks: [],
          product: {
            data: {
              attributes: {
                ...strapiTutorialListPages.data[0].attributes.product.data
                  .attributes,
                bannerLinks: [],
              },
            },
          },
          tutorials: {
            data: [],
          },
          seo: undefined,
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

export function tutorialListPagesWithoutBannerLinks(): StrapiTutorialListPages {
  return {
    data: [
      {
        id: 1,
        attributes: {
          title: 'No Banner Tutorials',
          description: 'No banner links',
          bannerLinks: [],
          product: minimalTutorialListPages().data[0].attributes.product,
          tutorials: {
            data: [],
          },
          seo: undefined,
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
