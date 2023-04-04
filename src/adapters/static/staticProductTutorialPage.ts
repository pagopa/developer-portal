import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import {
  GetProductTutorialPageBy,
  GetProductTutorialPages,
} from '@/domain/productTutorialPage';
import { ioSignTutorialPage } from './products/ioSignPages';

export const getProductTutorialPages: GetProductTutorialPages = () => [
  ioSignTutorialPage,
];

export const getProductTutorialPageBy: GetProductTutorialPageBy = (
  productSlug,
  pageSlug
) =>
  pipe(
    getProductTutorialPages(),
    RA.findFirst(
      (page) => page.product.slug === productSlug && page.slug === pageSlug
    )
  );
