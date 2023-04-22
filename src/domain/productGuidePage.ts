import { Product } from './productPage';

export type ProductGuidePage = {
  product: Product;
  // TODO: Remove all the slug
  guideSlug: string;
  versionSlug: string;
  slug: string;
  title: string;
  // TODO: At the moment use string
  // which is a markdown content
  body: string;
};
