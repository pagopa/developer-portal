import { Collection } from "@/domain/collection";

const pagoPaOrgId = process.env["PAGOPA_ORG_ID"];
const token = process.env["GITBOOK_API_KEY"];

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
  const baseUrl = `https://api.gitbook.com/v1/orgs/${pagoPaOrgId}/collections`;
  const url = pageId ? `${baseUrl}?page=${pageId}` : baseUrl;
  console.log(`Making http call to ${url}`);
  const getCollectionsReq = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return getCollectionsReq.json();
};

export const getCollections = async (pageId?: string): Promise<ReadonlyArray<Collection>> => {
  const inner = async (acc: ReadonlyArray<Collection>, pageId?: string): Promise<ReadonlyArray<Collection>> => {
    const { items, next } = await getGitBookCollectionList(pageId);
    const result = [...acc, ...items];
    return (next?.page) ? inner(result, next.page) : result;
  }
  return inner([], pageId);
};

export const getCollectionById = async (id: string): Promise<Collection> => {
  const productDetailReq = await fetch(
    `https://api.gitbook.com/v1/collections/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const productDetailResp = await productDetailReq.json();
  return {
    ...productDetailResp,
  };
};
