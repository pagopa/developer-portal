import { mapUrlReplaceMap } from '@/lib/urlReplaceMap/mapper';
import {
  expectedUrlReplaceMap,
  strapiUrlReplaceMap,
} from '@/lib/urlReplaceMap/__tests__/fixtures';
import {
  urlReplaceMapMultiple,
  urlReplaceMapSingle,
} from '@/lib/urlReplaceMap/__tests__/factories';
import { wrapAsRootEntity } from '../../__tests__/strapiEntityWrappers';

describe('mapUrlReplaceMap', () => {
  it('should map a single entry with subPath', () => {
    const urlReplaceMap = mapUrlReplaceMap(
      'it',
      wrapAsRootEntity(strapiUrlReplaceMap)
    );

    expect(urlReplaceMap).toEqual(expectedUrlReplaceMap);
  });

  it('should map a single entry without subPath', () => {
    const data = urlReplaceMapSingle({ subPath: undefined });
    const urlReplaceMap = mapUrlReplaceMap('it', { data });

    expect(urlReplaceMap).toEqual({
      'source-url': '/it/product-slug/guides/guide-slug',
    });
  });

  it('should map multiple entries', () => {
    const data = urlReplaceMapMultiple();
    const urlReplaceMap = mapUrlReplaceMap('it', { data });

    expect(urlReplaceMap).toEqual({
      a: '/it/product-slug/guides/guide-slug',
      b: '/it/p-2/guides/s-2/x',
    });
  });
});
