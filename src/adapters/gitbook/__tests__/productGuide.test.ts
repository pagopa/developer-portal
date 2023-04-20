import * as E from 'fp-ts/Either';
import { GitBookAPI } from '@gitbook/api';
import { mockDeep } from 'jest-mock-extended';
import { getAllProductGuide } from '../productGuide';
import { ProductGuide } from '@/domain/productGuide';
import { collection, productGuideCollection, revision, space } from './data';

describe('getAllProductGuide', () => {
  it('should fetch collections', async () => {
    const clientMock = mockDeep<GitBookAPI>();
    clientMock.collections.getCollectionById.mockReturnValue(
      Promise.resolve({ data: collection } as any)
    );
    clientMock.collections.listSpacesInCollectionById.mockReturnValue(
      Promise.resolve({ data: { items: [space] } } as any)
    );
    clientMock.spaces.getCurrentRevision.mockReturnValue(
      Promise.resolve({ data: revision } as any)
    );
    const actual = await getAllProductGuide(clientMock, [
      productGuideCollection,
    ])();
    const expected: ProductGuide = {
      product: productGuideCollection.product,
      slug: collection.path || '',
      title: collection.title,
      versions: [
        {
          title: space.title,
          slug: space.title,
          pages: [],
        },
      ],
    };
    expect(actual).toStrictEqual(E.of([expected]));
  });
});
