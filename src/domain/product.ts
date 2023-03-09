import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as RA from 'fp-ts/lib/ReadonlyArray';

const pageRefList = [
  {
    title: 'Panoramica',
    href: '/firma-con-io/panoramica',
  },
  {
    title: 'Quick Start',
    href: '/firma-con-io/quick-start',
  },
];
const contents = [
  {
    productPageId: {
      product: 'firma-con-io',
      page: 'panoramica',
    },
    productName: 'Firma con IO',
    productPages: pageRefList,
    body: 'Panoramica',
  },
  {
    productPageId: {
      product: 'firma-con-io',
      page: 'quick-start',
    },
    productName: 'Firma con IO',
    productPages: pageRefList,
    body: 'QuickStart',
  },
];

export type PageRef = {
  title: string;
  href: string;
};

export type ProductPageId = {
  product: string;
  page: string;
};

export type ProductPage = {
  productName: string;
  productPages: ReadonlyArray<PageRef>;
  body: string;
};

export const getProductPageIdList = (): ReadonlyArray<ProductPageId> =>
  pipe(
    contents,
    RA.map(({ productPageId }) => productPageId)
  );

export const getProductPage = (pageId: ProductPageId): ProductPage =>
  pipe(
    contents,
    RA.findFirst(
      ({ productPageId: { product, page } }) =>
        product === pageId.product && page === pageId.page
    ),
    // TODO Fix the default
    O.getOrElse(() => contents[0])
  );
