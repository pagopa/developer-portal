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
      Promise.resolve({ data: collection } as any)
    );
    clientMock.collections.listSpacesInCollectionById.mockReturnValue(
      Promise.resolve({ data: { items: [space] } } as any)
    );
    clientMock.spaces.getCurrentRevision.mockReturnValue(
      Promise.resolve({ data: revision } as any)
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
  });
});
