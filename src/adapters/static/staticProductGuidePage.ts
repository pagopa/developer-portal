import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import {
  GetProductGuidePageBy,
  GetProductGuidePages,
} from '@/domain/productGuidePage';
import {
  ioAppGuideTechGuideV23InitialSetup,
  ioAppGuideTechGuideV23DevPortalSignUp,
  ioAppGuideTechGuideV23CreateService,
  ioAppGuideTechGuideV23Home,
  ioAppGuideTechGuideV23PublishService,
} from './products/ioAppPages';

export const getProductGuidePages: GetProductGuidePages = () => [
  ioAppGuideTechGuideV23Home,
  ioAppGuideTechGuideV23InitialSetup,
  ioAppGuideTechGuideV23CreateService,
  ioAppGuideTechGuideV23PublishService,
  ioAppGuideTechGuideV23DevPortalSignUp,
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
