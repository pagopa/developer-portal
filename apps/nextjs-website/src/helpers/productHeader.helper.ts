import { Product } from '@/lib/types/product';
import { MenuDropdownProp } from '@pagopa/pagopa-editorial-components/dist/components/Header/components/MenuDropdown';
import { Theme } from '@pagopa/pagopa-editorial-components/dist/types/components';

export function productToMenuItems(
  product: Product,
  path: string,
  theme: Theme
): readonly MenuDropdownProp[] {
  return Object.entries(product.subpaths)
    .filter(([name, subpath]) => !!name && !!subpath)
    .map(([, subpath]) => {
      return {
        label: subpath.name,
        href: subpath.path,
        active: path === subpath.path,
        theme,
      };
    });
}
