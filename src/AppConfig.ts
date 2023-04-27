import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as PR from 'io-ts/PathReporter';
import { GitBookConfig } from './adapters/gitbook/GitBookEnv';

type AppConfig = {
  gitbook: GitBookConfig;
};

const EnvCodec = t.type({
  GITBOOK_API_KEY: t.string,
});

const guideToSync: AppConfig['gitbook']['guideToSync'] = [
  {
    product: { name: 'p0', slug: 'ps0' },
    collectionId: 'Cw40sL8INZ5p5FDkWQSD',
  },
];

/**
 * Reads environment variables and creates an AppConfig object.
 * Returns Either an error message or an instance of AppConfig
 */
export const makeConfig = (
  env: Record<string, string | undefined>
): E.Either<Error, AppConfig> =>
  pipe(
    EnvCodec.decode(env),
    E.bimap(
      (errors) => new Error(PR.failure(errors).join('\n')),
      (envs) => ({
        gitbook: {
          apiKey: envs.GITBOOK_API_KEY,
          guideToSync,
        },
      })
    )
  );
