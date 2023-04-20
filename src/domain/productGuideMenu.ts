import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';

type ProductGuideMenuPage = {
  title: string;
  kind: 'page';
  description: string;
  path: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideMenuPage>;
};

type ProductGuideMenuGroup = {
  title: string;
  kind: 'group';
  path: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideMenuPage>;
};

export type ProductGuideMenuItem = ProductGuideMenuPage | ProductGuideMenuGroup;

export type ProductGuideMenu = ReadonlyArray<ProductGuideMenuItem>;

export const isCurrent = (
  currentPath: string,
  menuItem: ProductGuideMenuItem
) =>
  pipe(
    currentPath.split('/'),
    RA.exists((path) => path === menuItem.slug)
  );

export const isOnAChildPage = (
  currentPath: string,
  menuItem: ProductGuideMenuItem
) =>
  pipe(
    currentPath.split('/'),
    RA.exists((pathSlug) =>
      pipe(
        menuItem.pages,
        RA.map(({ slug }) => slug),
        RA.exists((pageSlug) => pageSlug === pathSlug)
      )
    )
  );
