import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import {
  overviewPageProps,
  strapiOverviews,
} from '@/lib/strapi/__tests__/fixtures/overviews';
import _ from 'lodash';
import {
  minimalDataSingleOverview,
  overviewWithEmptyGuideProductSlug,
  overviewWithEmptyProductSlug,
  overviewWithMissingTutorialProductSlug,
  overviewWithMissingTutorialSlug,
} from '@/lib/strapi/__tests__/factories/overviews';
import { consoleSpy } from './consoleMock';

describe('makeOverviewsProps', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('should transform strapi overviews to overview page props', () => {
    const result = makeOverviewsProps(_.cloneDeep(strapiOverviews));

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(overviewPageProps);
  });

  it('should handle minimal data with null optional fields', () => {
    const result = makeOverviewsProps(_.cloneDeep(minimalDataSingleOverview()));

    expect(result).toHaveLength(1);
    const firseElement = result[0];
    expect(firseElement.feature).toBeUndefined();
    expect(firseElement.startInfo).toBeUndefined();
    expect(firseElement.tutorials).toBeUndefined();
    expect(firseElement.postIntegration).toBeUndefined();
    expect(firseElement.relatedLinks).toBeUndefined();
    expect(firseElement.whatsNew).toBeUndefined();
    expect(firseElement.seo).toBeUndefined();
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

    const result = makeOverviewsProps(emptyData);

    expect(result).toHaveLength(0);
  });

  it('should log an error and skip overview with empty product slug', () => {
    const result = makeOverviewsProps(overviewWithEmptyProductSlug());
    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error processing Overview for product: "Piattaforma pagoPA": Missing product slug'
    );
  });

  it('should log an error and skip overview with missing product slug', () => {
    const result = makeOverviewsProps(overviewWithEmptyProductSlug());
    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error processing Overview for product: "Piattaforma pagoPA": Missing product slug'
    );
  });

  it('should log an error and skip tutorials with missing product slug', () => {
    const result = makeOverviewsProps(overviewWithMissingTutorialProductSlug());
    expect(result).toHaveLength(1);
    expect(result[0].tutorials?.list).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      "tutorial's product slug is missing:",
      'Tutorial 1'
    );
  });

  it('should log an error and skip tutorials with missing product slug', () => {
    const result = makeOverviewsProps(overviewWithMissingTutorialSlug());
    expect(result).toHaveLength(1);
    expect(result[0].tutorials?.list).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      'tutorial slug is missing:',
      'Tutorial 1'
    );
  });

  it('should log an error and skip guides with empty product slug', () => {
    const result = makeOverviewsProps(overviewWithEmptyGuideProductSlug());
    expect(result).toHaveLength(1);
    expect(result[0].postIntegration?.guides).toHaveLength(1);
    expect(result[0].postIntegration?.guides?.[0].title).toBe('Document 1');
  });
});
