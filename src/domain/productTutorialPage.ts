import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { Product } from './productPage';

export type ProductTutorialPage = {
  product: Product;
  slug: string;
  title: string;
  description: string;
  // TODO: At the moment use string
  // which is a markdown content
  body: string;
};

/** The entry point to retrieve tutorials */
export type ProductTutorialPageReader = {
  // return full path of all tutorial pages
  getAllPaths: () => TE.TaskEither<Error, ReadonlyArray<string>>;
  // return a ProductTutorialPage given a path
  getPageBy: (
    path: string
  ) => TE.TaskEither<Error, O.Option<ProductTutorialPage>>;
};
