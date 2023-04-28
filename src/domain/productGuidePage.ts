import * as T from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { Product } from './productPage';
import { ProductGuideNav } from './productGuideNavigator';

export type ProductGuidePage = {
  product: Product;
  nav: ProductGuideNav;
  title: string;
  // TODO: At the moment use string
  // which is a markdown content
  body: string;
};

// Capabilities

export type ProductGuidePageReader = {
  // return full path of all product guide page
  getAllPaths: () => T.TaskEither<Error, ReadonlyArray<string>>;
  // return a ProductGuidePage given a path
  getPageBy: (path: string) => T.TaskEither<Error, O.Option<ProductGuidePage>>;
};
