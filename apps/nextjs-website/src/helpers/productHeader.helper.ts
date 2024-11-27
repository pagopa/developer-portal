import { Product } from '@/lib/types/product';
import { MenuDropdownProp } from '@/editorialComponents/Header/components/MenuDropdown';
import { Theme } from '@/editorialComponents/types/components';

export function productToMenuItems(
  product: Product,
  path: string,
  theme: Theme
): readonly MenuDropdownProp[] {
  return [
    // if there's overview data, add it to the menu
    product.hasOverviewPage
      ? {
          label: 'devPortal.productHeader.overview',
          href: `/${product.slug}/overview`,
          active: path.startsWith(`/${product.slug}/overview`),
          theme,
        }
      : null,
    // if there's quiskstart guide data, add it to the menu
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
    // if there's tutorials data, add it to the menu
    product.hasTutorialListPage
      ? {
          label: 'devPortal.productHeader.tutorials',
          href: `/${product.slug}/tutorials`,
          active: path.startsWith(`/${product.slug}/tutorials`),
          theme,
        }
      : null,
    // if there's guides data, add it to the menu
    product.hasGuideListPage
      ? {
          label: 'devPortal.productHeader.guides',
          href: `/${product.slug}/guides`,
          active: path.startsWith(`/${product.slug}/guides`),
          theme,
        }
      : null,
  ].filter((item) => item !== null) as readonly MenuDropdownProp[];
}
