import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import { NextEnv, makeNextConfig, makeNextEnv } from './NextEnv';
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '../static/staticNav';

// TODO: Find a way to load the appEnv only once and
// somehow provides it to the entire application
export const nextEnv = pipe(
  TE.fromEither(makeNextConfig(process.env)),
  TE.chain(makeNextEnv)
);

// Return the homepage
export const getHomepage = pipe(
  R.ask<Pick<NextEnv, 'homepageReader'>>(),
  R.map(({ homepageReader }) => homepageReader.getPage())
);

// Return all the product page path
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
    R.ask<Pick<NextEnv, 'productPageReader'>>(),
    R.map(({ productPageReader }) =>
      pipe(
        productPageReader.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(staticNav, page.product),
            ...page,
          }))
        )
      )
    )
  );

// Return all the product guide page path
export const getAllProductGudePagePaths = pipe(
  R.ask<Pick<NextEnv, 'productGuidePageReader'>>(),
  R.map(({ productGuidePageReader }) =>
    pipe(
      productGuidePageReader.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product guide page given the path if any
export const findProductGuidePageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productGuidePageReader'>>(),
    R.map(({ productGuidePageReader }) =>
      pipe(
        productGuidePageReader.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(staticNav, page.product),
            ...page,
          }))
        )
      )
    )
  );

// Return all the product tutorial page path
export const getAllProductTutorialPagePaths = pipe(
  R.ask<Pick<NextEnv, 'productTutorialPageReader'>>(),
  R.map(({ productTutorialPageReader }) =>
    pipe(
      productTutorialPageReader.getAllPaths(),
      TE.map((paths) => Array.from(paths))
    )
  )
);

// Return a product tutorial page given the path if any
export const findProductTutorialPageByPath = (pagePath: string) =>
  pipe(
    R.ask<Pick<NextEnv, 'productTutorialPageReader'>>(),
    R.map(({ productTutorialPageReader }) =>
      pipe(
        productTutorialPageReader.getPageBy(pagePath),
        TE.map(
          O.map((page) => ({
            navLinks: makeMenu(staticNav, page.product),
            ...page,
          }))
        )
      )
    )
  );
