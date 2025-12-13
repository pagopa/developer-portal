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
    const urlReplaceMap = makeUrlReplaceMap({
      data: strapiUrlReplaceMapFixture,
    });
    expect(urlReplaceMap).toEqual(expectedUrlReplaceMapFixture);
  });

  it('should map a single entry without subPath', () => {
    const data = urlReplaceMapSingle({ subPath: undefined });
    const urlReplaceMap = makeUrlReplaceMap({ data: data });

    expect(urlReplaceMap).toEqual({
      'source-url': '/product-slug/guides/guide-slug',
    });
  });

  it('should map multiple entries', () => {
    const data = urlReplaceMapMultiple();
    const urlReplaceMap = makeUrlReplaceMap({ data: data });

    expect(urlReplaceMap).toEqual({
      a: '/product-slug/guides/guide-slug',
      b: '/p-2/guides/s-2/x',
    });
  });
});
