import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import {
  expectedSolutionTemplateProps,
  strapiSolutions,
} from '@/lib/__tests__/fixtures/solutions';
import {
  minimalDataSolutions,
  solutionsWithItemMissingCaseHistorySlug,
  solutionsWithItemMissingSolutionSlug,
  solutionsWithItemWithoutCaseHistories,
  solutionsWithItemWithoutWebinars,
} from '@/lib/__tests__/factories/solutions';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';
import { mapSolutionsProps } from '@/lib/solutions/mapper';
import { StrapiSolutions } from '@/lib/solutions/types';
import { cloneDeep } from 'lodash';

describe('mapSolutionsProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi solutions to solution props', () => {
    const result = mapSolutionsProps('it', cloneDeep(strapiSolutions));

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(expectedSolutionTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = mapSolutionsProps('it', cloneDeep(minimalDataSolutions()));
    const firstElement = result[0] as SolutionTemplateProps;

    expect(result).toHaveLength(1);
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

    const result = mapSolutionsProps('it', emptyData);

    expect(result).toHaveLength(0);
  });

  it('should handle solutions without case histories', () => {
    const result = mapSolutionsProps(
      'it',
      solutionsWithItemWithoutCaseHistories()
    );

    expect(result[0].successStories).toBeUndefined();
  });

  it('should handle solutions without webinars', () => {
    const result = mapSolutionsProps('it', solutionsWithItemWithoutWebinars());

    expect(result[0].webinars).toEqual([]);
  });

  it('should skip solutions with missing slug and log error', () => {
    const result = mapSolutionsProps('it', solutionsWithItemMissingSolutionSlug());

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Valid Solution');
    expect(result[0].solutionSlug).toBe('valid-solution');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Solution: missing title or slug. Title: Solution Without Slug | Slug: undefined. Skipping...'
    );
  });

  it('should skip case histories with missing slug and log error', () => {
    const result = mapSolutionsProps(
      'it',
      solutionsWithItemMissingCaseHistorySlug()
    );

    expect(result).toHaveLength(1);
    expect(result[0].successStories?.stories).toHaveLength(1);
    expect(result[0].successStories?.stories[0].title).toBe(
      'Valid Case History'
    );
    expect(result[0].successStories?.stories[0].path).toBe(
      '/it/case-histories/valid-case-history'
    );
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing CaseHistory with title "Case History Without Slug": missing slug. Skipping...'
    );
  });
});
