import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';

export type ProductGuideNavItem = {
  path: string;
  name: {
    nav: string;
    breadcrumb: string;
  };
} & ({ kind: 'group' } | { kind: 'page' } | { kind: 'link'; href: string });

export type ProductGuideNav = ReadonlyArray<ProductGuideNavItem>;

type ProductGuideMenuItem = {
  name: string;
} & (
  | { kind: 'group'; path: string }
  | { kind: 'page'; path: string; children: ProductGuideMenu }
  | { kind: 'link'; href: string }
);

export type ProductGuideMenu = ReadonlyArray<ProductGuideMenuItem>;

const isChild = (path: string, child: string): boolean =>
  child.startsWith(path) && child.replace(path, '').split('/').length === 2;

export const getDirectChildrenOf = (
  path: string,
  nav: ProductGuideNav
): ProductGuideNav =>
  pipe(
    nav,
    RA.filter(
      (item) =>
        isChild(path.replace(/\/$/, ''), item.path.replace(/\/$/, '')) ||
        (item.kind === 'link' && item.path === path)
    )
  );
