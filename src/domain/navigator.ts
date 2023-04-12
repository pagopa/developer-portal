import * as S from 'fp-ts/lib/string';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { contramap } from 'fp-ts/lib/Ord';
import { Product } from './productPage';

type NavItem = {
  path: string;
  name: {
    // No nav, not in Menu
    nav?: string;
    breadcrumb: string;
  };
};

export type Nav = ReadonlyArray<NavItem>;

// Represents a menu item in a menu.
type MenuItem = {
  // The name of the menu item.
  name: string;
  // The path of the menu item.
  path: string;
};

/**
 * Represents a menu, which is an array of menu items.
 */
export type Menu = ReadonlyArray<MenuItem>;

/**
 * Generates a menu from a navigation structure (Nav) and a product object.
 * The resulting menu is an array of objects where each item has a name
 * and a path.
 *
 * Only NavItem objects that are children of the product's rootPath will be
 * included in the menu.
 */
export const makeMenu = (nav: Nav, product: Product): Menu =>
  pipe(
    nav,
    // keep only children items
    RA.filter(isChild(`/${product.slug}`)),
    // keep only items with a nav value
    RA.filterMap((item) =>
      item.name.nav ? O.some({ path: item.path, name: item.name.nav }) : O.none
    )
  );

// Represents a breadcrumb item in a breadcrumb trail.
type BreadcrumbItem = {
  // The name of the breadcrumb item.
  name: string;
  // The path of the breadcrumb item.
  path: string;
  // Indicates whether the breadcrumb item is the current one.
  isCurrent: boolean;
};

/**
 * Represents a breadcrumb trail, which is an array of breadcrumb items.
 */
export type Breadcrumbs = ReadonlyArray<BreadcrumbItem>;

const isChild =
  (path: string) =>
  (l: Pick<NavItem, 'path'>): boolean =>
    l.path.startsWith(path);

export const isAncestor =
  (path: string) =>
  (l: Pick<NavItem, 'path'>): boolean =>
    path.startsWith(l.path);

/**
 * Generates breadcrumbs from a navigation structure (Nav) and a current path.
 * The resulting breadcrumbs are an array of breadcrumb objects, where each
 * object represents a level in the breadcrumb trail.
 */
export const makeBreadcrumbs = (nav: Nav, currentPath: string): Breadcrumbs =>
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
