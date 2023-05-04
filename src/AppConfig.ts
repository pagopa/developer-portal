import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as PR from 'io-ts/PathReporter';
import { GitBookConfig } from './adapters/gitbook/GitBookEnv';

export type AppConfig = {
  gitbook: GitBookConfig;
};

const EnvCodec = t.type({
  GITBOOK_API_KEY: t.string,
});

const guidesToSync: AppConfig['gitbook']['guidesToSync'] = [
  {
    product: { name: 'App IO', slug: 'app-io' },
    collectionId: 'jGL1aFISone0197CLeGA',
  },
];

/** Provides a way to create an instance of AppConfig */
export const makeAppConfig = (
  env: Record<string, string | undefined>
): E.Either<Error, AppConfig> =>
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
