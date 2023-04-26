import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { ProductGuidePageReader } from './domain/productGuidePage';
import { makeProductGuidePageReader } from './adapters/gitbook/makeProductGuidePageReader';

export type AppEnv = {
  productGuidePageReader: ProductGuidePageReader;
};

export const makeAppEnv = (
  env: Record<string, string | undefined>
): TE.TaskEither<Error, AppEnv> =>
  Apply.sequenceS(TE.ApplySeq)({
    productGuidePageReader: makeProductGuidePageReader(env),
  });
