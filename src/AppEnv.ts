import * as Apply from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { AppConfig } from './AppConfig';
import { ProductGuidePageReader } from './domain/productGuidePage';
import { makeProductGuidePageReader } from './adapters/gitbook/makeProductGuidePageReader';
import { ProductTutorialPageReader } from './domain/productTutorialPage';
import { makeProductTutorialPageReader } from './adapters/static/makeProductTutorialPageReader';
import { ProductPageReader } from './domain/productPage';
import { makeProductPageReader } from './adapters/static/makeProductPageReader';

/** Defines the environment that is needed for the application to run */
type AppEnv = {
  productGuidePageReader: ProductGuidePageReader;
  productTutorialPageReader: ProductTutorialPageReader;
  productPageReader: ProductPageReader,
};

/** The entrypoint to create a production AppEnv */
export const makeAppEnv = (config: AppConfig): TE.TaskEither<Error, AppEnv> =>
  Apply.sequenceS(TE.ApplySeq)({
    productGuidePageReader: makeProductGuidePageReader(config.gitbook),
    productTutorialPageReader: TE.of(makeProductTutorialPageReader()),
    productPageReader: TE.of(makeProductPageReader()),
  });
