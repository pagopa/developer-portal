import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { ProductPageCollector } from 'core/domain/productPage';
import {
  ioSignOverviewPage,
  ioSignQuickStartPage,
  ioSignTutorialIndexPage,
} from './products/ioSignPages';
import { ioAppGuideIndex } from './products/ioAppPages';

const pages = [
  ioSignOverviewPage,
  ioSignQuickStartPage,
  ioSignTutorialIndexPage,
  ioAppGuideIndex,
];

export const makeProductPageCollector = (): ProductPageCollector => ({
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
