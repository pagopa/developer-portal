import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { GitBookAPI } from '@gitbook/api';
import {
  GitBookProductGuide,
  fetchAllGitBookProductGuide,
} from './gitbookProductGuide';
import { Product } from 'core/domain/productPage';

/**
 * Represents the configuration needed to create a GitBookEnv.
 * `guidesToSync` defines the GitBook collection that should be synced and the
 * product which belongs to
 */
export type GitBookConfig = {
  readonly apiKey: string;
  readonly guidesToSync: ReadonlyArray<{
    readonly product: Product;
    readonly collectionId: string;
  }>;
};

const makeGitBookClient = (apiKey: string) => {
  return new GitBookAPI({
    authToken: apiKey,
  });
};

export type GitBookEnv = {
  readonly client: GitBookAPI;
  readonly allGitBookProductGuides: ReadonlyArray<GitBookProductGuide>;
};

/** Provide a way to create an instance of GitBookEnv */
export const makeGitBookEnv = (
  config: GitBookConfig
): TE.TaskEither<Error, GitBookEnv> =>
  pipe(
    TE.Do,
    TE.apS('client', TE.of(makeGitBookClient(config.apiKey))),
    TE.bind('allGitBookProductGuides', ({ client }) =>
      fetchAllGitBookProductGuide(config.guidesToSync)(client)
    )
  );
