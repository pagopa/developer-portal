import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { GitBookAPI } from '@gitbook/api';
import { makeGitBookClient } from './client';
import {
  GitBookProductGuide,
  fetchAllGitBookProductGuide,
} from './gitbookProductGuide';

const guideCollection = [
  {
    product: { name: 'p0', slug: 'ps0' },
    collectionId: 'Cw40sL8INZ5p5FDkWQSD',
  },
];

export type GitBookEnv = {
  client: GitBookAPI;
  allGitBookProductGuide: ReadonlyArray<GitBookProductGuide>;
};

export const makeGitBookEnv = (
  env: Record<string, string | undefined>
): TE.TaskEither<Error, GitBookEnv> =>
  pipe(
    TE.Do,
    TE.apS(
      'client',
      pipe(
        env['GITBOOK_API_KEY'],
        TE.fromNullable(new Error('GITBOOK_API_KEY not defined')),
        TE.map(makeGitBookClient)
      )
    ),
    TE.bind('allGitBookProductGuide', ({ client }) =>
      fetchAllGitBookProductGuide(guideCollection)(client)
    )
  );
