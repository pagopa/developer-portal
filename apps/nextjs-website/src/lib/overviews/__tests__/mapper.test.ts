import _ from 'lodash';
import { mapOverviewsProps } from '@/lib/overviews/mapper';
import { StrapiOverviews } from '@/lib/overviews/types';
import {
  overviewPageProps,
  strapiOverviews,
} from '@/lib/shared/fixtures/overviews';
import {
  minimalDataSingleOverview,
  overviewsWithItemMissingGuideProductSlug,
  overviewsWithItemMissingProductSlug,
  overviewsWithItemMissingTutorialProductSlug,
  overviewsWithItemMissingTutorialSlug,
  overviewsWithItemWithEmptyGuideProductSlug,
  overviewsWithItemWithEmptyProductSlug,
} from '@/lib/shared/factories/overviews';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('mapOverviewsProps', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi overviews to overview page props', () => {
    const result = mapOverviewsProps('it', _.cloneDeep(strapiOverviews));

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(overviewPageProps);
  });

  it('should handle minimal data with null optional fields', () => {
    const result = mapOverviewsProps(
      'it',
      _.cloneDeep(minimalDataSingleOverview())
    );

    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.feature).toBeUndefined();
    expect(firstElement.startInfo).toBeUndefined();
    expect(firstElement.tutorials).toBeUndefined();
    expect(firstElement.postIntegration).toBeUndefined();
    expect(firstElement.relatedLinks).toBeUndefined();
    expect(firstElement.whatsNew).toBeUndefined();
    expect(firstElement.seo).toBeUndefined();
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiOverviews = {
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

    const result = mapOverviewsProps('it', emptyData);

    expect(result).toHaveLength(0);
  });

  it('should log an error and skip overview with empty product slug', () => {
    const result = mapOverviewsProps(
      'it',
      overviewsWithItemWithEmptyProductSlug()
    );

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Overview with title "Test Overview": missing product slug. Skipping...'
    );
  });

  it('should log an error and skip overview with missing product slug', () => {
    const result = mapOverviewsProps(
      'it',
      overviewsWithItemMissingProductSlug()
    );

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Overview with title "Test Overview": missing product slug. Skipping...'
    );
  });

  it('should log an error and skip tutorials with missing product slug', () => {
    const result = mapOverviewsProps(
      'it',
      overviewsWithItemMissingTutorialProductSlug()
    );

    expect(result).toHaveLength(1);
    expect(result[0].tutorials?.list).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      "tutorial's product slug is missing:",
      'Tutorial 1'
    );
  });

  it('should log an error and skip tutorials with missing slug', () => {
    const result = mapOverviewsProps(
      'it',
      overviewsWithItemMissingTutorialSlug()
    );

    expect(result).toHaveLength(1);
    expect(result[0].tutorials?.list).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'tutorial slug is missing:',
      'Tutorial 1'
    );
  });

  it('should log an error and skip guides with empty product slug', () => {
    const result = mapOverviewsProps(
      'it',
      overviewsWithItemWithEmptyGuideProductSlug()
    );

    expect(result).toHaveLength(1);
    expect(result[0].postIntegration?.guides).toHaveLength(1);
    expect(result[0].postIntegration?.guides?.[0].title).toBe('Document 1');
  });

  it('should log an error and skip guides with missing product slug', () => {
    const result = mapOverviewsProps(
      'it',
      overviewsWithItemMissingGuideProductSlug()
    );

    expect(result).toHaveLength(1);
    expect(result[0].postIntegration?.guides).toHaveLength(1);
    expect(result[0].postIntegration?.guides?.[0].title).toBe('Document 1');
  });
});
