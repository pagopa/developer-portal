export type ProductGuideNavItem = {
  path: string;
  name: {
    nav: string;
    breadcrumb: string;
  };
} & ({ kind: 'group' } | { kind: 'page' } | { kind: 'link'; href: string });

export type ProductGuideNav = ReadonlyArray<ProductGuideNavItem>;

/**
 * Given a parent path and an nav item return true if the nav is a children
 * of the given parent path
 */
export const isChild =
  (parentPath: string) =>
  (item: ProductGuideNavItem): boolean => {
    // TODO: Create a new type for path and provide a smart constructor that removes
    // the trailing slash
    // Remove the trailing slash if any
    const parentPathWithoutTrailing = parentPath.replace(/\/$/, '');
    const itemPathWithoutTrailing = item.path.replace(/\/$/, '');
    return (
      itemPathWithoutTrailing.startsWith(parentPathWithoutTrailing) &&
      item.path.replace(`${parentPathWithoutTrailing}/`, '').split('/')
        .length === 1
    );
  };
