import { Product } from '@/lib/types/product';
import { MenuDropdownProp } from '@/editorialComponents/Header/components/MenuDropdown';
import { Theme } from '@/editorialComponents/types/components';

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
        active: path.startsWith(subpath.path),
        theme,
      };
    });
}
