import * as E from 'fp-ts/Either';
import { GitBookAPI } from '@gitbook/api';
import { mockDeep } from 'jest-mock-extended';
import { collection, productGuideCollection, revision, space } from './data';
import { fetchAllGitBookProductGuide } from '../gitbookProductGuide';

describe('fetchAllGitBookProductGuide', () => {
  it('should fetch all the product guides', async () => {
    const clientMock = mockDeep<GitBookAPI>();
    /* mock */
    clientMock.collections.getCollectionById.mockReturnValue(
      Promise.resolve({ data: collection } as never)
    );
    clientMock.collections.listSpacesInCollectionById.mockReturnValue(
      Promise.resolve({ data: { items: [space] } } as never)
    );
    clientMock.spaces.getCurrentRevision.mockReturnValue(
      Promise.resolve({ data: revision } as never)
    );
    const expected = {
      product: productGuideCollection.product,
      collection,
      space,
      revision,
      path: `/${productGuideCollection.product.slug}/guide-manuali/${collection.path}/${space.title}`,
      nav: [],
    };
    const actual = await fetchAllGitBookProductGuide([productGuideCollection])(
      clientMock
    )();
    expect(actual).toStrictEqual(E.of([expected]));
    expect(clientMock.collections.getCollectionById).toBeCalledWith(
      productGuideCollection.collectionId
    );
    expect(clientMock.collections.listSpacesInCollectionById).toBeCalledWith(
      productGuideCollection.collectionId
    );
    expect(clientMock.spaces.getCurrentRevision).toBeCalledWith(space.id);
    expect(clientMock.collections.getCollectionById).toBeCalledTimes(1);
    expect(clientMock.collections.listSpacesInCollectionById).toBeCalledTimes(
      1
    );
    expect(clientMock.spaces.getCurrentRevision).toBeCalledTimes(1);
  });
});
