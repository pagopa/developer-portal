import { HomepageCollector } from 'core/domain/homepage';
import { ProductGuidePageCollector } from 'core/domain/productGuidePage';
import { ProductPageCollector } from 'core/domain/productPage';
import { ProductTutorialPageCollector } from 'core/domain/productTutorialPage';
import * as t from 'io-ts';
import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as PR from 'io-ts/PathReporter';
import { GitBookConfig } from 'gitbook-adapters/adapters/gitbook/GitBookEnv';
import { makeProductGuidePageCollector } from 'gitbook-adapters/adapters/gitbook/makeProductGuidePageCollector';
import { makeProductTutorialPageCollector } from '../static/makeProductTutorialPageCollector';
import { makeProductPageCollector } from '../static/makeProductPageCollector';
import { makeHomepageCollector } from '../static/makeHomepageCollector';
import { pipe } from 'fp-ts/lib/function';
import { NavCollector } from 'core/domain/navigator';
import { makeNavCollector } from '../static/makeNavCollector';

export type NextConfig = {
  gitbook: GitBookConfig;
};

const EnvCodec = t.type({
  GITBOOK_API_KEY: t.string,
});

const guidesToSync: NextConfig['gitbook']['guidesToSync'] = [
  {
    product: { name: 'App IO', slug: 'app-io' },
    collectionId: 'jGL1aFISone0197CLeGA',
  },
];

export const makeNextConfig = (
  env: Record<string, string | undefined>
): E.Either<Error, NextConfig> =>
  pipe(
    EnvCodec.decode(env),
    E.bimap(
      (errors) => new Error(PR.failure(errors).join('\n')),
      (envs) => ({
        gitbook: {
          apiKey: envs.GITBOOK_API_KEY,
          guidesToSync,
        },
      })
    )
  );

/** Contains everything required to run the next application */
export type NextEnv = {
  navCollector: NavCollector;
  productGuidePageCollector: ProductGuidePageCollector;
  productTutorialPageCollector: ProductTutorialPageCollector;
  productPageCollector: ProductPageCollector;
  homepageCollector: HomepageCollector;
};

export const makeNextEnv = (
  config: NextConfig
): TE.TaskEither<Error, NextEnv> =>
  Apply.sequenceS(TE.ApplySeq)({
    navCollector: TE.of(makeNavCollector()),
    productGuidePageCollector: makeProductGuidePageCollector(config.gitbook),
    productTutorialPageCollector: TE.of(makeProductTutorialPageCollector()),
    productPageCollector: TE.of(makeProductPageCollector()),
    homepageCollector: TE.of(makeHomepageCollector()),
  });
