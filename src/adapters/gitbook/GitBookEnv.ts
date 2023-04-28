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

export type GitBookEnv = {
  client: GitBookAPI;
  allGitBookProductGuide: ReadonlyArray<GitBookProductGuide>;
};

/** Provide a way to create an instance of GitBookEnv */
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
