import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { GetProductGuidePageBy, GetProductGuidePages } from '@/domain/productGuidePage';
import { ioAppGuideTechGuideV23Changelog, ioAppGuideTechGuideV23Home } from './products/ioAppPages';

export const getProductGuidePages: GetProductGuidePages = () => [
  ioAppGuideTechGuideV23Home, ioAppGuideTechGuideV23Changelog
];

export const getProductGuidePageBy: GetProductGuidePageBy = (
  productSlug,
  guideSlug,
  versionSlug,
  pageSlug
) =>
  pipe(
    getProductGuidePages(),
    RA.findFirst(
      (page) =>
        page.product.slug === productSlug &&
        page.guideSlug === guideSlug &&
        page.versionSlug === versionSlug &&
        page.slug === pageSlug
    )
  );
