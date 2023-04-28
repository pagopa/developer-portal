import { pipe } from 'fp-ts/lib/function';
import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { ProductGuidePageReader } from './domain/productGuidePage';
import { makeProductGuidePageReader } from './adapters/gitbook/makeProductGuidePageReader';
import { makeConfig } from './AppConfig';

/** Defines the environment that is needed for the application to run. */
export type AppEnv = {
  productGuidePageReader: ProductGuidePageReader;
};

/** Provides a way to create an instance of AppEnv */
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
