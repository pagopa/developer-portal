import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import { NextEnv, makeNextConfig, makeNextEnv } from './NextEnv';
import { makeBreadcrumbs, makeMenu } from '@/domain/navigator';

/** Produce a production environment ready to use */
export const nextEnv = pipe(
  TE.fromEither(makeNextConfig(process.env)),
  TE.chain(makeNextEnv)
);

// Return the homepage
export const getHomepage = pipe(
  R.ask<Pick<NextEnv, 'homepageReader'>>(),
  R.map(({ homepageReader }) => homepageReader.getPage())
);

// Return all the product page paths
export const getAllProductPagePaths = pipe(
  R.ask<Pick<NextEnv, 'productPageReader'>>(),
  R.map(({ productPageReader }) =>
    pipe(
      productPageReader.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product page given the path if any
export const findProductPageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productPageReader' | 'navReader'>>(),
    R.map(({ productPageReader, navReader }) =>
      pipe(
        productPageReader.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(navReader.getNav(), page.product),
            breadcrumbs: makeBreadcrumbs(navReader.getNav(), pagePath),
            ...page,
          }))
        )
      )
    )
  );

// Return all the product guide page paths
export const getAllProductGudePagePaths = pipe(
  R.ask<Pick<NextEnv, 'productGuidePageReader'>>(),
  R.map(({ productGuidePageReader }) =>
    pipe(
      productGuidePageReader.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product guide page given the path
export const findProductGuidePageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productGuidePageReader' | 'navReader'>>(),
    R.map(({ productGuidePageReader, navReader }) =>
      pipe(
        productGuidePageReader.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(navReader.getNav(), page.product),
            breadcrumbs: makeBreadcrumbs(
              [...navReader.getNav(), ...page.nav],
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
  R.ask<Pick<NextEnv, 'productTutorialPageReader'>>(),
  R.map(({ productTutorialPageReader }) =>
    pipe(
      productTutorialPageReader.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product tutorial page given the path
export const findProductTutorialPageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productTutorialPageReader' | 'navReader'>>(),
    R.map(({ productTutorialPageReader, navReader }) =>
      pipe(
        productTutorialPageReader.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(navReader.getNav(), page.product),
            breadcrumbs: makeBreadcrumbs(navReader.getNav(), pagePath),
            ...page,
          }))
        )
      )
    )
  );
