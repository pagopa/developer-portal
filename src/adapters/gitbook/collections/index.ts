import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';
import { Collection } from '@/domain/collection';
import { makeHttpClient, makeHttpRequest } from '@/adapters/http/axios/client';

// TODO: Move this to a config file
const gitBookApiKey = process.env['GITBOOK_API_KEY'];
const gitBookBaseUrl =
  process.env['GITBOOK_BASE_URL'] || 'https://api.gitbook.com';
const gitBookConfig = {
  baseURL: new URL(gitBookBaseUrl),
  orgId: process.env['GITBOOK_ORG_ID'],
  apiKey: gitBookApiKey,
  headers: {
    Authorization: `Bearer ${gitBookApiKey}`,
  },
  apiTimeout: Number(process.env['GITBOOK_API_TIMEOUT_MS']),
};

const GitBookCollection = t.type({
  object: t.string,
  id: t.string,
  title: t.string,
  visibility: t.string,
});
type GitBookCollection = t.TypeOf<typeof GitBookCollection>;

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

const gitBookClient = makeHttpClient({
  baseURL: gitBookConfig.baseURL,
  headers: gitBookConfig.headers,
  timeout: gitBookConfig.apiTimeout,
});

const getGitBookCollectionList = (
  pageId?: string
): TE.TaskEither<Error, GitBookCollectionList> => {
  const { orgId, baseURL } = gitBookConfig;
  const collectionsUrl = new URL(`/v1/orgs/${orgId}/collections`, baseURL);
  const searchParams = new URLSearchParams({ nested: 'false' });
  if (pageId) {
    searchParams.append('page', pageId);
  }
  collectionsUrl.search = searchParams.toString();

  return makeHttpRequest(() => gitBookClient.get(collectionsUrl.href))(
    GitBookCollectionList.decode
  );
};

export const getCollections = (
  pageId?: string
): TE.TaskEither<Error, ReadonlyArray<Collection>> => {
  const innerGetGitBookCollections = (
    pageId?: string,
    acc: ReadonlyArray<GitBookCollection> = []
  ): TE.TaskEither<Error, ReadonlyArray<GitBookCollection>> =>
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

export const getCollectionById = (
  id: string
): TE.TaskEither<Error, Collection> => {
  const getCollectionByIdUrl = new URL(
    `/v1/collections/${id}`,
    gitBookConfig.baseURL
  );
  return pipe(
    makeHttpRequest(() => gitBookClient.get(getCollectionByIdUrl.href))(
      GitBookCollection.decode
    ),
    TE.map(makeCollection)
  );
};
