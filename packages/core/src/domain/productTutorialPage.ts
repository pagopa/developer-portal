import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { Product } from './productPage';

export type ProductTutorialPage = {
  readonly product: Product;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  // TODO: At the moment use string
  // which is a markdown content
  readonly body: string;
};

/** The entry point to retrieve tutorials */
export type ProductTutorialPageCollector = {
  // return full path of all tutorial pages
  readonly getAllPaths: () => TE.TaskEither<Error, ReadonlyArray<string>>;
  // return a ProductTutorialPage given a path
  readonly getPageBy: (
    path: string
  ) => TE.TaskEither<Error, O.Option<ProductTutorialPage>>;
};
