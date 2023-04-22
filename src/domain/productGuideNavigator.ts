export type ProductGuideNavItem = {
  path: string;
  name: {
    nav: string;
    breadcrumb: string;
  };
} & ({ kind: 'group' | 'page' } | { kind: 'link'; href: string });

export type ProductGuideNav = ReadonlyArray<ProductGuideNavItem>;
