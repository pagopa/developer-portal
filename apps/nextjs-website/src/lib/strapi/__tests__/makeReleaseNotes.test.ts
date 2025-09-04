import { makeReleaseNotesProps } from '@/lib/strapi/makeProps/makeReleaseNotes';
import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import _ from 'lodash';
import {
  strapiReleaseNotes,
  expectedReleaseNotePageProps,
} from '@/lib/strapi/__tests__/fixtures/releaseNotes';
import {
  minimalDataReleaseNotes,
  releaseNotesWithoutBannerLinks,
  releaseNotesWithoutProductBannerLinks,
  releaseNotesWithMissingProductSlug,
} from '@/lib/strapi/__tests__/factories/releaseNotes';
import { consoleSpy } from '@/lib/strapi/__tests__/consoleMock';

describe('makeReleaseNotesProps', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('should transform strapi release notes to release note page props', () => {
    const result = makeReleaseNotesProps(_.cloneDeep(strapiReleaseNotes));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(expectedReleaseNotePageProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeReleaseNotesProps(
      _.cloneDeep(minimalDataReleaseNotes())
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Minimal Release Notes');
    expect(result[0].dirName).toBe('minimal-release-notes');
    expect(result[0].landingFile).toBe('minimal.md');
    expect(result[0].bannerLinks).toBeUndefined();
    expect(result[0].seo).toBeUndefined();
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiReleaseNotes = {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    };
    const result = makeReleaseNotesProps(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should use product banner links when release note banner links are empty', () => {
    const result = makeReleaseNotesProps(releaseNotesWithoutBannerLinks());
    expect(result[0].bannerLinks).toBeDefined();
    expect(result[0].bannerLinks).toHaveLength(1);
    expect(result[0].bannerLinks?.[0].title).toBe('Banner Link 1');
  });

  it('should handle release notes without banner links and without product banner links', () => {
    const result = makeReleaseNotesProps(
      releaseNotesWithoutProductBannerLinks()
    );
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should correctly generate path from product slug', () => {
    const result = makeReleaseNotesProps(strapiReleaseNotes);
    expect(result[0].path).toBe('/test-product/release-note');
  });

  it('should prioritize release note banner links over product banner links', () => {
    const result = makeReleaseNotesProps(strapiReleaseNotes);
    expect(result[0].bannerLinks).toHaveLength(2);
    expect(result[0].bannerLinks?.[0].title).toBe('Banner Link 1');
    expect(result[0].bannerLinks?.[1].title).toBe('Banner Link 2');
  });

  it('should handle release notes with product that has undefined banner links', () => {
    const result = makeReleaseNotesProps(minimalDataReleaseNotes());
    expect(result[0].bannerLinks).toBeUndefined();
  });

  it('should throw error for release note whose product has missing slug', () => {
    const result = makeReleaseNotesProps(releaseNotesWithMissingProductSlug());
    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error processing Release Note "Release Note Without Product Slug": Missing product slug. Skipping...'
    );
  });
});
