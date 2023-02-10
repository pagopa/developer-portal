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

type GitBookCollection = {
  object: string;
  id: string;
  title: string;
  path?: string;
  visibility: string;
  collection?: string;
  publishingType?: string;
  primarySpace?: string;
};

type Next = {
  page: string;
};

type GitBookCollectionList = {
  items: ReadonlyArray<GitBookCollection>;
  next?: Next;
};

const getGitBookCollectionList = async (
  pageId?: string
): Promise<GitBookCollectionList> => {
  const { orgId, baseURL, headers } = gitBookConfig;
  const collectionsUrl = new URL(`/v1/orgs/${orgId}/collections`, baseURL);
  const searchParams = new URLSearchParams({ nested: 'false' });
  if (pageId) {
    searchParams.append('page', pageId);
  }
  collectionsUrl.search = searchParams.toString();
  console.log(`Making http call to ${collectionsUrl.href}`);
  const getCollectionsReq = await fetch(collectionsUrl, {
    headers,
  });
  return getCollectionsReq.json();
};

export const getCollections = async (
  pageId?: string
): Promise<ReadonlyArray<Collection>> => {
  const inner = async (
    acc: ReadonlyArray<Collection>,
    pageId?: string
  ): Promise<ReadonlyArray<Collection>> => {
    const { items, next } = await getGitBookCollectionList(pageId);
    const result = [...acc, ...items];
    return next?.page ? inner(result, next.page) : result;
  };
  return inner([], pageId);
};

export const getCollectionById = async (id: string): Promise<Collection> => {
  const { baseURL, headers } = gitBookConfig;
  const productDetailReq = await fetch(
    new URL(`/v1/collections/${id}`, baseURL),
    {
      headers,
    }
  );
  const productDetailResp = await productDetailReq.json();
  return {
    ...productDetailResp,
  };
};
