import { strapiTutorialListPages } from '../fixtures/tutorialListPage';
import { StrapiUseCaseListPages } from '@/lib/strapi/types/useCaseListPage';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalUseCaseListPages(): StrapiUseCaseListPages {
  return wrapAsPaginatedRootEntity([
    {
      id: 1,
      title: 'Minimal Use Cases',
      description: '',
      bannerLinks: [],
      product: {
        ...strapiTutorialListPages.data[0].product!,
        bannerLinks: [],
      },
      useCases: [],
      seo: undefined,
      enableFilters: undefined,
    },
  ]) as StrapiUseCaseListPages;
}

export function useCaseListPagesWithItemMissingBannerLinks(): StrapiUseCaseListPages {
  return wrapAsPaginatedRootEntity([
    {
      id: 1,
      title: 'No Banner Tutorials',
      description: 'No banner links',
      bannerLinks: [],
      product: minimalUseCaseListPages().data[0].product,
      useCases: [],
      seo: undefined,
      enableFilters: true,
    },
  ]) as StrapiUseCaseListPages;
}

export function emptyUseCaseListPages(): StrapiUseCaseListPages {
  return wrapAsPaginatedRootEntity([]) as StrapiUseCaseListPages;
}
