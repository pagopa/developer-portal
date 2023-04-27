import { pipe } from 'fp-ts/lib/function';
import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { ProductGuidePageReader } from './domain/productGuidePage';
import { makeProductGuidePageReader } from './adapters/gitbook/makeProductGuidePageReader';
import { makeConfig } from './AppConfig';

/**
 * Defines the shape of the environment that is needed for the application to
 * run.
 */
export type AppEnv = {
  productGuidePageReader: ProductGuidePageReader;
};

/**
 * Creates an instance of AppEnv. It takes an environment object as input, and
 * returns a TaskEither that either resolves to an instance of AppEnv or rejects
 * with an error.
 */
export const makeAppEnv = (
  env: Record<string, string | undefined>
): TE.TaskEither<Error, AppEnv> =>
  pipe(
    TE.fromEither(makeConfig(env)),
    TE.chain((config) =>
      Apply.sequenceS(TE.ApplySeq)({
        productGuidePageReader: makeProductGuidePageReader(config.gitbook),
      })
    )
  );
