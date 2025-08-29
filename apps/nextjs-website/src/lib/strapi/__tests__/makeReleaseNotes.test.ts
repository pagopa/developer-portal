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
  releaseNotesWithMissingProduct,
  releaseNotesWithoutProductBannerLinks,
  mixedReleaseNotesWithAndWithoutProduct,
  releaseNotesWithCorruptedData,
  allInvalidReleaseNotes,
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

  it('should skip release notes with missing product and log error', () => {
    const result = makeReleaseNotesProps(releaseNotesWithMissingProduct());

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Release note "Release Note Without Product" is missing the associated product. Skipping...'
    );
  });

  it('should handle mixed valid and invalid release notes', () => {
    const result = makeReleaseNotesProps(
      mixedReleaseNotesWithAndWithoutProduct()
    );

    // Should return only the 2 valid release notes, skipping the invalid one
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Release Notes Title');
    expect(result[1].title).toBe('Another Valid Release Note');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Release note "Release Note Without Product" is missing the associated product. Skipping...'
    );
  });

  it('should handle release notes without banner links and without product banner links', () => {
    const result = makeReleaseNotesProps(
      releaseNotesWithoutProductBannerLinks()
    );
    expect(result[0].bannerLinks).toEqual([]);
  });

  it('should handle corrupted data with try/catch and log error', () => {
    const result = makeReleaseNotesProps(releaseNotesWithCorruptedData());

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error while making release note props for Corrupted Release Note',
      expect.any(Error)
    );
  });

  it('should return empty array when all release notes are invalid', () => {
    const result = makeReleaseNotesProps(allInvalidReleaseNotes());

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
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
});
