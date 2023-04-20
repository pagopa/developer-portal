import * as TE from 'fp-ts/TaskEither';
import { Product } from './productPage';

export type ProductGuide = {
  product: Product;
  title: string;
  slug: string;
  versions: ReadonlyArray<ProductGuideVersion>;
};

type ProductGuideVersion = {
  title: string;
  slug: string;
  pages: ReadonlyArray<
    | ProductGuideVersionSheet
    | ProductGuideVersionGroup
    | ProductGuideVersionLink
  >;
};

type ProductGuideVersionSheet = {
  kind: 'sheet';
  title: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideVersionSheet | ProductGuideVersionLink>;
};

type ProductGuideVersionGroup = {
  kind: 'group';
  title: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideVersionSheet | ProductGuideVersionLink>;
};

type ProductGuideVersionLink = {
  kind: 'link';
  title: string;
  href?: string;
};

// Capabilities
// Retrieve all the product guide to renderPage
export type GetAllProductGuide = TE.TaskEither<
  Error,
  ReadonlyArray<ProductGuide>
>;
