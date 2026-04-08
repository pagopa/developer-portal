import { mapUrlReplaceMap } from '@/lib/urlReplaceMap/mapper';
import {
  expectedUrlReplaceMapFixture,
  strapiUrlReplaceMapFixture,
} from '@/lib/urlReplaceMap/__tests__/fixtures';
import {
  urlReplaceMapMultiple,
  urlReplaceMapSingle,
} from '@/lib/urlReplaceMap/__tests__/factories';

describe('mapUrlReplaceMap', () => {
  it('should map a single entry with subPath', () => {
    const urlReplaceMap = mapUrlReplaceMap('it', {
      data: strapiUrlReplaceMapFixture,
    });

    expect(urlReplaceMap).toEqual(expectedUrlReplaceMapFixture);
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
