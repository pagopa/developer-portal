import * as RA from 'fp-ts/lib/ReadonlyArray';
import { GetProductPageBy, GetProductPages } from '@/domain/productPage';
import { pipe } from 'fp-ts/lib/function';
import {
  ioSignOverviewPage,
  ioSignQuickStartPage,
  ioSignTutorialIndexPage,
} from './products/ioSignPages';

export const getProductPages: GetProductPages = () => [
  ioSignOverviewPage,
  ioSignQuickStartPage,
  ioSignTutorialIndexPage,
];

export const getProductPageBy: GetProductPageBy = (productSlug, pageSlug) =>
  pipe(
    getProductPages(),
    RA.findFirst(
      (page) => page.product.slug === productSlug && page.slug === pageSlug
    )
  );
