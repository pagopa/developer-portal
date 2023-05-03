import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { ProductGuidePageReader } from './domain/productGuidePage';
import { makeProductGuidePageReader } from './adapters/gitbook/makeProductGuidePageReader';
import { AppConfig } from './AppConfig';

/** Defines the environment that is needed for the application to run. */
type AppEnv = {
  productGuidePageReader: ProductGuidePageReader;
};

/** Provides a way to create an instance of AppEnv */
export const makeAppEnv = (config: AppConfig): TE.TaskEither<Error, AppEnv> =>
  Apply.sequenceS(TE.ApplySeq)({
    productGuidePageReader: makeProductGuidePageReader(config.gitbook),
  });
