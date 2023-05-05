import { HomepageReader } from '@/domain/homepage';
import { ProductGuidePageReader } from '@/domain/productGuidePage';
import { ProductPageReader } from '@/domain/productPage';
import { ProductTutorialPageReader } from '@/domain/productTutorialPage';
import * as t from 'io-ts';
import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as PR from 'io-ts/PathReporter';
import { GitBookConfig } from '../gitbook/GitBookEnv';
import { makeProductGuidePageReader } from '../gitbook/makeProductGuidePageReader';
import { makeProductTutorialPageReader } from '../static/makeProductTutorialPageReader';
import { makeProductPageReader } from '../static/makeProductPageReader';
import { makeHomepageReader } from '../static/makeHomepageReader';
import { pipe } from 'fp-ts/lib/function';
import { NavReader } from '@/domain/navigator';
import { makeNavReader } from '../static/makeNavReader';

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

/** Defines the environment that is needed for the application to run */
export type NextEnv = {
  navReader: NavReader;
  productGuidePageReader: ProductGuidePageReader;
  productTutorialPageReader: ProductTutorialPageReader;
  productPageReader: ProductPageReader;
  homepageReader: HomepageReader;
};

/** The entrypoint to create a environment */
export const makeNextEnv = (
  config: NextConfig
): TE.TaskEither<Error, NextEnv> =>
  Apply.sequenceS(TE.ApplySeq)({
    navReader: TE.of(makeNavReader()),
    productGuidePageReader: makeProductGuidePageReader(config.gitbook),
    productTutorialPageReader: TE.of(makeProductTutorialPageReader()),
    productPageReader: TE.of(makeProductPageReader()),
    homepageReader: TE.of(makeHomepageReader()),
  });
