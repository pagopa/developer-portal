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
    const pathWithoutTrailing = path.replace(/\/$/, '');
    const itemPathWithoutTrailing = item.path.replace(/\/$/, '');
    return (
      itemPathWithoutTrailing.startsWith(pathWithoutTrailing) &&
      item.path.replace(`${pathWithoutTrailing}/`, '').split('/').length === 1
    );
  };
