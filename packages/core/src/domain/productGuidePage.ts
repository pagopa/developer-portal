import * as T from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { Nav } from './navigator';
import { Product } from './productPage';
import { ProductGuideNav } from './productGuideNavigator';

export type ProductGuidePage = {
  readonly product: Product;
  readonly guidePath: string;
  readonly versionsNav: Nav;
  readonly nav: ProductGuideNav;
  readonly title: string;
  // TODO: At the moment use string
  // which is a markdown content
  readonly body: string;
};

/** The entry-point to retrieve guides */
export type ProductGuidePageCollector = {
  // return full path of all product guide page
  readonly getAllPaths: () => T.TaskEither<Error, ReadonlyArray<string>>;
  // return a ProductGuidePage given a path
  readonly getPageBy: (
    path: string
  ) => T.TaskEither<Error, O.Option<ProductGuidePage>>;
};
