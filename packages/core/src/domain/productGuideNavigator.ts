export type ProductGuideNavItem = {
  readonly path: string;
  readonly name: {
    readonly nav: string;
    readonly breadcrumb: string;
  };
} & (
  | { readonly kind: 'group' }
  | { readonly kind: 'page' }
  | { readonly kind: 'link'; readonly href: string }
);

export type ProductGuideNav = ReadonlyArray<ProductGuideNavItem>;

/**
 * Given a parent path and a nav item return true if the nav is a children
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
