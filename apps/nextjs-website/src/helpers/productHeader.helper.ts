import { Product } from '@/lib/types/product';
import { MenuDropdownProp } from '@/editorialComponents/Header/components/MenuDropdown';
import { Theme } from '@/editorialComponents/types/components';

export function productToMenuItems(
  locale: string,
  product: Product,
  path: string,
  theme: Theme
): readonly MenuDropdownProp[] {
  return [
    product.hasOverviewPage
      ? {
          label: 'devPortal.productHeader.overview',
          href: `/${locale}/${product.slug}/overview`,
          active: path.startsWith(`/${locale}/${product.slug}/overview`),
          theme,
        }
      : null,
    product.hasQuickstartGuidePage
      ? {
          label: 'devPortal.productHeader.quickStartGuide',
          href: `/${locale}/${product.slug}/quick-start`,
          active: path.startsWith(`/${locale}/${product.slug}/quick-start`),
          theme,
        }
      : null,
    product.hasApiDataListPage
      ? {
          label: 'devPortal.productHeader.api',
          href: product.apiDataListPageUrl,
          active: path.startsWith(`/${locale}/${product.slug}/api`),
          theme,
        }
      : null,
    product.hasUseCaseListPage
      ? {
          label: 'devPortal.productHeader.useCases',
          href: `/${locale}/${product.slug}/use-cases`,
          active: path.startsWith(`/${locale}/${product.slug}/use-cases`),
          theme,
        }
      : null,
    product.hasTutorialListPage
      ? {
          label: 'devPortal.productHeader.tutorials',
          href: `/${locale}/${product.slug}/tutorials`,
          active: path.startsWith(`/${locale}/${product.slug}/tutorials`),
          theme,
        }
      : null,
    product.hasGuideListPage
      ? {
          label: 'devPortal.productHeader.guides',
          href: `/${locale}/${product.slug}/guides`,
          active: path.startsWith(`/${locale}/${product.slug}/guides`),
          theme,
        }
      : null,
    product.hasReleaseNotePage
      ? {
          label: 'devPortal.productHeader.releaseNote',
          href: `/${locale}/${product.slug}/release-note`,
          active: path.startsWith(`/${locale}/${product.slug}/release-note`),
          theme,
        }
      : null,
  ].filter((item) => item !== null) as readonly MenuDropdownProp[];
}
