import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import { NextEnv, makeNextConfig, makeNextEnv } from './NextEnv';
import { makeBreadcrumbs, makeMenu } from 'core/domain/navigator';

/** Produce a production environment ready to use */
export const nextEnv = pipe(
  TE.fromEither(makeNextConfig(process.env)),
  TE.chain(makeNextEnv)
);

// Return the homepage
export const getHomepage = pipe(
  R.ask<Pick<NextEnv, 'homepageCollector'>>(),
  R.map(({ homepageCollector }) => homepageCollector.getPage())
);

// Return all the product page paths
export const getAllProductPagePaths = pipe(
  R.ask<Pick<NextEnv, 'productPageCollector'>>(),
  R.map(({ productPageCollector }) =>
    pipe(
      productPageCollector.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product page given the path if any
export const findProductPageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productPageCollector' | 'navCollector'>>(),
    R.map(({ productPageCollector, navCollector }) =>
      pipe(
        productPageCollector.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(navCollector.getNav(), page.product),
            breadcrumbs: makeBreadcrumbs(navCollector.getNav(), pagePath),
            ...page,
          }))
        )
      )
    )
  );

// Return all the product guide page paths
export const getAllProductGuidePagePaths = pipe(
  R.ask<Pick<NextEnv, 'productGuidePageCollector'>>(),
  R.map(({ productGuidePageCollector }) =>
    pipe(
      productGuidePageCollector.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product guide page given the path
export const findProductGuidePageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productGuidePageCollector' | 'navCollector'>>(),
    R.map(({ productGuidePageCollector, navCollector }) =>
      pipe(
        productGuidePageCollector.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(navCollector.getNav(), page.product),
            breadcrumbs: makeBreadcrumbs(
              [...navCollector.getNav(), ...page.nav],
              pagePath
            ),
            ...page,
          }))
        )
      )
    )
  );

// Return all the product tutorial page paths
export const getAllProductTutorialPagePaths = pipe(
  R.ask<Pick<NextEnv, 'productTutorialPageCollector'>>(),
  R.map(({ productTutorialPageCollector }) =>
    pipe(
      productTutorialPageCollector.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product tutorial page given the path
export const findProductTutorialPageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productTutorialPageCollector' | 'navCollector'>>(),
    R.map(({ productTutorialPageCollector, navCollector }) =>
      pipe(
        productTutorialPageCollector.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(navCollector.getNav(), page.product),
            breadcrumbs: makeBreadcrumbs(navCollector.getNav(), pagePath),
            ...page,
          }))
        )
      )
    )
  );
