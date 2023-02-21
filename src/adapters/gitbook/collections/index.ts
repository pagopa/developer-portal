import * as TE from 'fp-ts/lib/TaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { Collection } from '@/domain/collection';
import { gitBookClient, gitBookConfig } from '@/adapters/gitbook/client';
import {
  GitBookCollection,
  GitBookList,
} from '@/adapters/gitbook/generated/api/Api';

const makeCollection = (gitBookCollection: GitBookCollection): Collection => ({
  id: gitBookCollection.id,
  title: gitBookCollection.title,
});

const getGitBookCollectionList = (
  pageId?: string
): TE.TaskEither<Error, GitBookList & { items: GitBookCollection[] }> =>
  pipe(
    TE.tryCatch(
      () =>
        gitBookClient.orgs.listCollectionsInOrganizationById(
          gitBookConfig.orgId,
          { nested: false, page: pageId }
        ),
      E.toError
    ),
    TE.map(({ data }) => data)
  );

export const getCollections = (
  pageId?: string
): TE.TaskEither<Error, ReadonlyArray<Collection>> => {
  const innerGetGitBookCollections = (
    pageId?: string,
    acc: ReadonlyArray<GitBookCollection> = []
  ): TE.TaskEither<Error, GitBookCollection[]> =>
    pipe(
      getGitBookCollectionList(pageId),
      TE.map(({ items, next }) => {
        const result = [...acc, ...items];
        return next?.page
          ? innerGetGitBookCollections(next.page, result)
          : TE.of(result);
      }),
      TE.flatten
    );

  return pipe(
    innerGetGitBookCollections(pageId),
    TE.map(RA.map(makeCollection))
  );
};
