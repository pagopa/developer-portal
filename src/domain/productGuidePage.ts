import * as O from 'fp-ts/Option';
import { Product } from './productPage';

export type ProductGuidePage = {
  product: Product;
  guideSlug: string;
  versionSlug: string;
  slug: string;
  title: string;
  // TODO: At the moment use string
  // which is a markdown content
  body: string;
};

export type GetProductGuidePages = () => ReadonlyArray<ProductGuidePage>;

export type GetProductGuidePageBy = (
  productSlug: string,
  guideSlug: string,
  versionSlug: string,
  pageSlug: string
) => O.Option<ProductGuidePage>;
