import * as O from 'fp-ts/lib/Option';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { Product } from './productPage';
import { pipe } from 'fp-ts/lib/function';

type ProductGuidePageKind = 'page' | 'group';

export type ProductGuidePage = {
  product: Product;
  guideSlug: string;
  versionSlug: string;
  slug: string;
  title: string;
  // TODO: At the moment use string
  // which is a markdown content
  body: string;
  kind: ProductGuidePageKind;
  children: ReadonlyArray<ProductGuidePage>;
};

export type GetProductGuidePages = () => ReadonlyArray<ProductGuidePage>;

export type GetProductGuidePageBy = (
  productSlug: string,
  guideSlug: string,
  versionSlug: string,
  pageSlug: string
) => O.Option<ProductGuidePage>;

export type GetProductGuideNavigationBy = (
  productSlug: string,
  guideSlug: string,
  versionSlug: string
) => ProductGuideMenu;

type ProductGuideMenuItem = {
  name: string;
  path: string;
  children: ReadonlyArray<ProductGuideMenuItem>;
  kind: ProductGuidePageKind;
};

export type ProductGuideMenu = ReadonlyArray<ProductGuideMenuItem>;

export const makeProductGuideMenuItem = (
  page: ProductGuidePage
): ProductGuideMenuItem => ({
  name: page.title,
  path: `/${page.product.slug}/guide-manuali/${page.guideSlug}/${page.versionSlug}/${page.slug}`,
  kind: page.kind,
  children: pipe(page.children, RA.map(makeProductGuideMenuItem)),
});
