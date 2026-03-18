import { makeUrlReplaceMap } from '../makeProps/makeUrlReplaceMap';
import {
  strapiUrlReplaceMapFixture,
  expectedUrlReplaceMapFixture,
} from './fixtures/urlReplaceMap';
import {
  urlReplaceMapSingle,
  urlReplaceMapMultiple,
} from './factories/urlReplaceMap';

describe('makeUrlReplaceMap', () => {
  it('should map a single entry with subPath', () => {
    const urlReplaceMap = makeUrlReplaceMap('it', strapiUrlReplaceMapFixture);
    expect(urlReplaceMap).toEqual(expectedUrlReplaceMapFixture);
  });

  it('should map a single entry without subPath', () => {
    const urlReplaceMap = makeUrlReplaceMap(
      'it',
      urlReplaceMapSingle({ subPath: undefined })
    );

    expect(urlReplaceMap).toEqual({
      'source-url': '/it/product-slug/guides/guide-slug',
    });
  });

  it('should map multiple entries', () => {
    const urlReplaceMap = makeUrlReplaceMap('it', urlReplaceMapMultiple());

    expect(urlReplaceMap).toEqual({
      a: '/it/product-slug/guides/guide-slug',
      b: '/it/p-2/guides/s-2/x',
    });
  });
});
