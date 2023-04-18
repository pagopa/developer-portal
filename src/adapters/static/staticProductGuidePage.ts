import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import {
  GetProductGuidePageBy,
  GetProductGuidePages,
} from '@/domain/productGuidePage';
import {
  ioAppGuideTechGuideV23SetUp,
  ioAppGuideTechGuideV23Changelog,
  ioAppGuideTechGuideV23CreateService,
  ioAppGuideTechGuideV23Functionalities,
  ioAppGuideTechGuideV23Home,
  ioAppGuideTechGuideV23PublishService,
  ioAppGuideTechGuideV23Adesione,
} from './products/ioAppPages';

export const getProductGuidePages: GetProductGuidePages = () => [
  ioAppGuideTechGuideV23SetUp,
  ioAppGuideTechGuideV23Adesione,
  ioAppGuideTechGuideV23Home,
  ioAppGuideTechGuideV23Changelog,
  ioAppGuideTechGuideV23Functionalities,
  ioAppGuideTechGuideV23PublishService,
  ioAppGuideTechGuideV23CreateService,
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
