import * as S from 'fp-ts/lib/string';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { contramap } from 'fp-ts/lib/Ord';
import { Product } from './product';

type NavItem = {
  path: string;
  name: {
    // No nav, not in Menu
    nav?: string;
    breadcrumb: string;
  };
};

export type Nav = ReadonlyArray<NavItem>;

type MenuItem = {
  name: string;
  path: string;
};

export type Menu = ReadonlyArray<MenuItem>;

export const makeMenu = (nav: Nav, product: Product): Menu =>
  pipe(
    nav,
    // keep only children items
    RA.filter(isChild(product.rootPath)),
    // keep only items with a nav value
    RA.filterMap((item) =>
      item.name.nav ? O.some({ path: item.path, name: item.name.nav }) : O.none
    )
  );

type Breadcrumb = {
  name: string;
  path: string;
  isCurrent: boolean;
};

export type Breadcrumbs = ReadonlyArray<Breadcrumb>;

const isChild =
  (path: string) =>
  (l: NavItem): boolean =>
    l.path.startsWith(path);

const isAncestor =
  (path: string) =>
  (l: NavItem): boolean =>
    path.startsWith(l.path);

export const makeBreadcrumbs =
  (nav: Nav) =>
  (currentPath: string): Breadcrumbs =>
    pipe(
      nav,
      // keep only ancestors of current
      RA.filter(isAncestor(currentPath)),
      // order by path length
      RA.sortBy([
        pipe(
          S.Ord,
          contramap((item: NavItem) => item.path)
        ),
      ]),
      RA.map((item) => ({
        path: item.path,
        name: item.name.breadcrumb,
        isCurrent: item.path === currentPath,
      }))
    );
