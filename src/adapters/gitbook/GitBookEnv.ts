import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { GitBookAPI } from '@gitbook/api';
import {
  GitBookProductGuide,
  fetchAllGitBookProductGuide,
} from './gitbookProductGuide';
import { Product } from '@/domain/productPage';

/**
 * Represents the configuration needed to create a GitBook environment.
 * `apiKey` is the GitBook API key used to access the GitBook API.
 * `guideToSync` is an array of objects that define the product and the GitBook
 * collection that should be synced.
 */
export type GitBookConfig = {
  apiKey: string;
  guideToSync: ReadonlyArray<{
    product: Product;
    collectionId: string;
  }>;
};

const makeGitBookClient = (apiKey: string) => {
  return new GitBookAPI({
    authToken: apiKey,
  });
};

/**
 * Defines the shape of the environment that is needed for the gitbook adapters
 * to run.
 */
export type GitBookEnv = {
  client: GitBookAPI;
  allGitBookProductGuide: ReadonlyArray<GitBookProductGuide>;
};

/**
 * Creates an instance of GitBookEnv. It takes a GitBookConfig object as
 * input, and returns a TaskEither that either resolves to an instance of
 * GitBookEnv or rejects with an error.
 */
export const makeGitBookEnv = (
  config: GitBookConfig
): TE.TaskEither<Error, GitBookEnv> =>
  pipe(
    TE.Do,
    TE.apS('client', TE.of(makeGitBookClient(config.apiKey))),
    TE.bind('allGitBookProductGuide', ({ client }) =>
      fetchAllGitBookProductGuide(config.guideToSync)(client)
    )
  );
