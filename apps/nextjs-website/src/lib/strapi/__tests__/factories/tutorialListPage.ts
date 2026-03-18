import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import { strapiTutorialListPages } from '../fixtures/tutorialListPage';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalTutorialListPages(): StrapiTutorialListPages {
  return wrapAsPaginatedRootEntity([
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
  ]) as StrapiTutorialListPages;
}

export function tutorialListPagesWithItemMissingBannerLinks(): StrapiTutorialListPages {
  return wrapAsPaginatedRootEntity([
    {
      id: 1,
      title: 'No Banner Tutorials',
      description: 'No banner links',
      bannerLinks: [],
      product: minimalTutorialListPages().data[0]!.product,
      tutorials: [],
      seo: undefined,
    },
  ]) as StrapiTutorialListPages;
}

export function emptyTutorialListPages(): StrapiTutorialListPages {
  return wrapAsPaginatedRootEntity([]) as StrapiTutorialListPages;
}
