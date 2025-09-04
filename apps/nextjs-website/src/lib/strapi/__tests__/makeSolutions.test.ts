import { makeSolutionsProps } from '@/lib/strapi/makeProps/makeSolutions';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';
import _ from 'lodash';
import {
  strapiSolutions,
  expectedSolutionTemplateProps,
} from '@/lib/strapi/__tests__/fixtures/solutions';
import {
  minimalDataSolutions,
  solutionsWithoutCaseHistories,
  solutionsWithoutWebinars,
  solutionsWithMissingSolutionSlug,
  solutionsWithMissingCaseHistorySlug,
} from '@/lib/strapi/__tests__/factories/solutions';
import { consoleSpy } from '@/lib/strapi/__tests__/consoleMock';

describe('makeSolutionsProps', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('should transform strapi solutions to solution props', () => {
    const result = makeSolutionsProps(_.cloneDeep(strapiSolutions));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(expectedSolutionTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeSolutionsProps(_.cloneDeep(minimalDataSolutions()));
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.description).toBeUndefined();
    expect(firstElement.introductionToSteps).toBeUndefined();
    expect(firstElement.steps).toEqual([]);
    expect(firstElement.stats).toEqual([]);
    expect(firstElement.statsSource).toBeUndefined();
    expect(firstElement.successStories).toBeUndefined();
    expect(firstElement.seo).toBeUndefined();
    expect(firstElement.bannerLinks).toBeDefined();
    expect(firstElement.webinars).toBeDefined();
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiSolutions = {
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
    const result = makeSolutionsProps(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should handle solutions without case histories', () => {
    const result = makeSolutionsProps(solutionsWithoutCaseHistories());
    expect(result[0].successStories).toBeUndefined();
  });

  it('should handle solutions without webinars', () => {
    const result = makeSolutionsProps(solutionsWithoutWebinars());
    expect(result[0].webinars).toEqual([]);
  });

  it('should skip solutions with missing slug and log error', () => {
    const result = makeSolutionsProps(solutionsWithMissingSolutionSlug());
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Valid Solution');
    expect(result[0].solutionSlug).toBe('valid-solution');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error processing Solution "Solution Without Slug": Missing solution slug. Skipping...'
    );
  });

  it('should skip case histories with missing slug and log error', () => {
    const result = makeSolutionsProps(solutionsWithMissingCaseHistorySlug());
    expect(result).toHaveLength(1);
    expect(result[0].successStories?.stories).toHaveLength(1);
    expect(result[0].successStories?.stories[0].title).toBe(
      'Valid Case History'
    );
    expect(result[0].successStories?.stories[0].path).toBe(
      '/case-histories/valid-case-history'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error processing Case History "Case History Without Slug": Missing case history slug. Skipping...'
    );
  });
});
