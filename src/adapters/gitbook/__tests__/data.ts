import { Collection, ContentVisibility, Revision, Space } from '@gitbook/api';

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
