import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import {
  ProductGuideNav,
  ProductGuideNavItem,
} from '@/domain/productGuideNavigator';
import { RevisionPage } from '@gitbook/api';

type GitBookProductGuideItem = { parentPath: string } & RevisionPage;

/**
 * Given a `GitBookProductGuideItem`, creates a `ProductGuideNavItem`.
 */
const makeProductGuideNavItem = (
  item: GitBookProductGuideItem
): ProductGuideNavItem => ({
  name: { nav: item.title, breadcrumb: item.title },
  path:
    item.kind === 'link' ? item.parentPath : `${item.parentPath}/${item.slug}`,
  ...(item.kind === 'link'
    ? { kind: 'link', href: item.href ?? '' }
    : { kind: item.kind === 'sheet' ? 'page' : item.kind }),
});

/**
 * Given an array of `GitBookProductGuideItem`s and an initial result, creates
 * a `ProductGuideNav`.
 */
export const makeProductGuideNav = (
  unprocessed: ReadonlyArray<GitBookProductGuideItem>,
  result: ProductGuideNav
): ProductGuideNav => {
  if (unprocessed.length > 0) {
    const [page, ...rest] = unprocessed;
    const navItem = makeProductGuideNavItem(page);
    const children = pipe(
      page.kind === 'link' ? [] : page.pages,
      RA.map((child) => ({ parentPath: navItem.path, ...child }))
    );
    return makeProductGuideNav([...children, ...rest], [...result, navItem]);
  } else {
    return result;
  }
};
