import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { PageBlock } from './pageBlock';

export type Product = {
  name: string;
  slug: string;
};

export type ProductPage = {
  product: Product;
  title: string;
  slug: string;
  blocks: ReadonlyArray<PageBlock>;
};

// Return all pages of type product
export type GetProductPages = () => ReadonlyArray<ProductPage>;

export type GetProductPageBy = (
  productSlug: string,
  pageSlug: string
) => O.Option<ProductPage>;

/** The entry point to retrieve product pages */
export type ProductPageReader = {
  // return full path of all product pages
  getAllPaths: () => TE.TaskEither<Error, ReadonlyArray<string>>;
  // return a product page given a path
  getPageBy: (path: string) => TE.TaskEither<Error, O.Option<ProductPage>>;
};
