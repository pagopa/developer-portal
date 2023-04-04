import * as O from 'fp-ts/Option';
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
