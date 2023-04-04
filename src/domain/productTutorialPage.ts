import * as O from 'fp-ts/Option';
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

export type GetProductTutorialPages = () => ReadonlyArray<ProductTutorialPage>;

export type GetProductTutorialPageBy = (
  productSlug: string,
  tutorialSlug: string
) => O.Option<ProductTutorialPage>;
