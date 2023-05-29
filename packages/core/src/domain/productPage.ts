import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { PageBlock } from './pageBlock';

export type Product = {
  readonly name: string;
  readonly slug: string;
};

export type ProductPage = {
  readonly product: Product;
  readonly title: string;
  readonly slug: string;
  readonly blocks: ReadonlyArray<PageBlock>;
};

/** The entry point to retrieve product pages */
export type ProductPageCollector = {
  // return full path of all product pages
  readonly getAllPaths: () => TE.TaskEither<Error, ReadonlyArray<string>>;
  // return a product page given a path
  readonly getPageBy: (
    path: string
  ) => TE.TaskEither<Error, O.Option<ProductPage>>;
};
