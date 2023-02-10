import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pipe, flow } from 'fp-ts/lib/function';
import { Collection } from '@/domain/collection';

// TODO: Move this to a config file
const gitBookApiKey = process.env['GITBOOK_API_KEY'];
const gitBookConfig = {
  baseURL: new URL('https://api.gitbook.com'),
  orgId: process.env['GITBOOK_ORG_ID'],
  apiKey: gitBookApiKey,
  headers: {
    Authorization: `Bearer ${gitBookApiKey}`,
  },
};

const GitBookCollection = t.type({
  object: t.string,
  id: t.string,
  title: t.string,
  visibility: t.string,
});
export type GitBookCollection = t.TypeOf<typeof GitBookCollection>;

const Next = t.type({
  page: t.string,
});

const GitBookCollectionList = t.type({
  items: t.readonlyArray(GitBookCollection),
  next: t.union([Next, t.undefined]),
});
type GitBookCollectionList = t.TypeOf<typeof GitBookCollectionList>;

const makeCollection = (gitBookCollection: GitBookCollection): Collection => ({
  id: gitBookCollection.id,
  title: gitBookCollection.title,
});

const getGitBookCollectionList = (
  pageId?: string
): TE.TaskEither<Error, GitBookCollectionList> => {
  const { orgId, baseURL, headers } = gitBookConfig;
  const collectionsUrl = new URL(`/v1/orgs/${orgId}/collections`, baseURL);
  const searchParams = new URLSearchParams({ nested: 'false' });
  if (pageId) {
    searchParams.append('page', pageId);
  }
  collectionsUrl.search = searchParams.toString();
  console.log(`Making http call to ${collectionsUrl.href}`);

  return pipe(
    TE.tryCatch(
      () =>
        fetch(collectionsUrl, {
          headers,
        }),
      E.toError
    ),
    TE.chain((response) => TE.tryCatch(() => response.json(), E.toError)),
    // Decode the response
    TE.map(GitBookCollectionList.decode),
    TE.map(
      // Handle decoding errors and transform to a TaskEither
      // TODO: Add custom logic to handle errors
      flow(
        E.mapLeft(
          (errors) => new Error(`Error decoding collectionList: ${errors}`)
        ),
        TE.fromEither
      )
    ),
    TE.flatten
  );
};

export const getCollections = (
  pageId?: string
): TE.TaskEither<Error, ReadonlyArray<Collection>> => {
  const innerGetGitBookCollections = (
    pageId?: string,
    acc: ReadonlyArray<GitBookCollection> = []
  ): TE.TaskEither<Error, ReadonlyArray<GitBookCollection>> => {
    return pipe(
      getGitBookCollectionList(pageId),
      TE.map(({ items, next }) => {
        const result = [...acc, ...items];
        return next?.page
          ? innerGetGitBookCollections(next.page, result)
          : TE.of(result);
      }),
      TE.flatten
    );
  };

  return pipe(
    innerGetGitBookCollections(pageId),
    TE.map(RA.map(makeCollection))
  );
};

export const getCollectionById = (
  id: string
): TE.TaskEither<Error, Collection> => {
  const { baseURL, headers } = gitBookConfig;

  return pipe(
    TE.tryCatch(
      () =>
        fetch(new URL(`/v1/collections/${id}`, baseURL), {
          headers,
        }),
      E.toError
    ),
    // response.json returns a Promise, so we handle it within a TaskEither.tryCatch
    TE.chain((response) => TE.tryCatch(() => response.json(), E.toError)),
    // Decode the response
    TE.map(GitBookCollection.decode),
    TE.map(
      // Handle decoding errors and transform to a TaskEither
      // TODO: Add custom logic to handle errors
      flow(
        E.mapLeft(
          (errors) => new Error(`Error decoding collection: ${errors}`)
        ),
        TE.fromEither
      )
    ),
    TE.flatten,
    // Convert to domain type
    TE.map(makeCollection)
  );
};
