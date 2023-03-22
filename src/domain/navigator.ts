import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

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

export const makeMenu = (nav: Nav): Menu =>
  pipe(
    nav,
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

// TODO: make breadcrumbs starting from current path
export const makeBreadcrumbs =
  (nav: Nav) =>
  (currentPath: string): Breadcrumbs =>
    pipe(
      nav,
      RA.map((item) => ({
        path: item.path,
        name: item.name.breadcrumb,
        isCurrent: item.path === currentPath,
      }))
    );
