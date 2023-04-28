export type ProductGuideNavItem = {
  path: string;
  name: {
    nav: string;
    breadcrumb: string;
  };
} & ({ kind: 'group' | 'page' } | { kind: 'link'; href: string });

export type ProductGuideNav = ReadonlyArray<ProductGuideNavItem>;

type ProductGuideMenuItem = {
  name: string;
} & (
  | { kind: 'group'; path: string }
  | { kind: 'page'; path: string; children: ProductGuideMenu }
  | { kind: 'link'; href: string }
);

export type ProductGuideMenu = ReadonlyArray<ProductGuideMenuItem>;
