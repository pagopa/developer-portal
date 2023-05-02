export type ProductGuideNavItem = {
  path: string;
  name: {
    nav: string;
    breadcrumb: string;
  };
} & ({ kind: 'group' } | { kind: 'page' } | { kind: 'link'; href: string });

export type ProductGuideNav = ReadonlyArray<ProductGuideNavItem>;

// TODO: Create a new type for path and provide a smart constructor that removes
// the trailing slash
export const isChild =
  (path: string) =>
  (item: ProductGuideNavItem): boolean => {
    // Remove the trailing slash if any
    const _path = path.replace(/\/$/, '');
    const _itemPath = item.path.replace(/\/$/, '');
    return (_itemPath.startsWith(_path) &&
      item.path.replace(`${_path}/`, '').split('/').length === 1);
  }
