import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { ProductPageReader } from '@/domain/productPage';
import {
  ioSignOverviewPage,
  ioSignQuickStartPage,
  ioSignTutorialIndexPage,
} from './products/ioSignPages';

const pages = [
  ioSignOverviewPage,
  ioSignQuickStartPage,
  ioSignTutorialIndexPage,
];

export const makeProductPageReader = (): ProductPageReader => ({
  getAllPaths: () =>
    pipe(
      pages,
      RA.map(({ product, slug }) => `/${product.slug}/${slug}`),
      TE.of
    ),
  getPageBy: (path) =>
    pipe(
      pages,
      RA.findFirst(({ product, slug }) => path === `/${product.slug}/${slug}`),
      TE.of
    ),
});
