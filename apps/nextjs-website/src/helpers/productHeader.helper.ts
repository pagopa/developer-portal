import { Product } from '@/lib/types/product';
import { MenuDropdownProp } from '@/editorialComponents/Header/components/MenuDropdown';
import { Theme } from '@/editorialComponents/types/components';

export function productToMenuItems(
  product: Product,
  path: string,
  theme: Theme
): readonly MenuDropdownProp[] {
  return [
    product.hasOverviewPage
      ? {
          label: 'devPortal.productHeader.overview',
          href: `/${product.slug}/overview`,
          active: path.startsWith(`/${product.slug}/overview`),
          theme,
        }
      : null,
    product.hasQuickstartGuidePage
      ? {
          label: 'devPortal.productHeader.quickStartGuide',
          href: `/${product.slug}/quick-start`,
          active: path.startsWith(`/${product.slug}/quick-start`),
          theme,
        }
      : null,
    product.hasApiDataListPage
      ? {
          label: 'devPortal.productHeader.api',
          href: product.apiDataListPageUrl,
          active: path.startsWith(`/${product.slug}/api`),
          theme,
        }
      : null,
    product.hasUseCaseListPage
      ? {
          label: 'devPortal.productHeader.useCases',
          href: `/${product.slug}/use-cases`,
          active: path.startsWith(`/${product.slug}/use-cases`),
          theme,
        }
      : null,
    product.hasTutorialListPage
      ? {
          label: 'devPortal.productHeader.tutorials',
          href: `/${product.slug}/tutorials`,
          active: path.startsWith(`/${product.slug}/tutorials`),
          theme,
        }
      : null,
    product.hasGuideListPage
      ? {
          label: 'devPortal.productHeader.guides',
          href: `/${product.slug}/guides`,
          active: path.startsWith(`/${product.slug}/guides`),
          theme,
        }
      : null,
    product.hasReleaseNotePage
      ? {
          label: 'devPortal.productHeader.releaseNote',
          href: `/${product.slug}/release-note`,
          active: path.startsWith(`/${product.slug}/release-note`),
          theme,
        }
      : null,
  ].filter((item) => item !== null) as readonly MenuDropdownProp[];
}
