import {
  Collection,
  ContentVisibility,
  Revision,
  RevisionPage,
  Space,
} from '@gitbook/api';

export const productGuideCollection = {
  product: { name: 'aProd', slug: 'aSlug' },
  collectionId: 'aCollId',
};

export const collection: Collection = {
  object: 'collection',
  id: 'aCollId',
  title: 'aCollTitle',
  path: 'aPath',
  visibility: ContentVisibility.Public,
};

export const space: Space = {
  object: 'space',
  id: 'aSpaceId',
  title: 'aSpaceTitle',
  visibility: ContentVisibility.InCollection,
  createdAt: '',
  updatedAt: '',
  urls: { app: '' },
};

export const revision: Revision = {
  object: 'revision',
  id: 'aRevisionId',
  parents: [],
  pages: [],
  files: [],
  urls: { app: '' },
};

const revision00: RevisionPage = {
  kind: 'sheet',
  id: 'anId',
  title: 'aTitle',
  slug: 'aSlug00',
  path: '/aSlug0/aSlug00',
  pages: [],
};
const revision0: RevisionPage = {
  kind: 'sheet',
  id: 'anId',
  title: 'aTitle',
  slug: 'aSlug0',
  path: '/aSlug0',
  pages: [revision00],
};
const revision1: RevisionPage = {
  kind: 'link',
  id: 'anId',
  title: 'aTitle',
  href: 'anHref',
};

export const gitBookProductGuideItemList = [
  { parentPath: '/parent', ...revision0 },
  { parentPath: '/parent', ...revision1 },
];
