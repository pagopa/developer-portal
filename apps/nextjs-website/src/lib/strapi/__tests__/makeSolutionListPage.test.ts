import { makeSolutionListPageProps } from '@/lib/strapi/makeProps/makeSolutionListPage';
import _ from 'lodash';
import {
  strapiSolutionListPage,
  expectedSolutionListTemplateProps,
} from '@/lib/strapi/__tests__/fixtures/solutionListPage';
import {
  minimalDataSolutionListPage,
  solutionListPageWithoutCaseHistories,
  solutionListPageWithoutFeatures,
  solutionListPageWithoutSolutions,
  solutionListPageWithMissingSolutionSlug,
  solutionListPageWithMissingCaseHistorySlug,
} from '@/lib/strapi/__tests__/factories/solutionListPage';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('makeSolutionListPageProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi solution list page to solution list template props', () => {
    const result = makeSolutionListPageProps(
      'it',
      _.cloneDeep(strapiSolutionListPage)
    );
    expect(result).toMatchObject(expectedSolutionListTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeSolutionListPageProps(
      'it',
      minimalDataSolutionListPage()
    );
    expect(result).not.toBeNull();
    expect(result.hero.title).toBe('Minimal Solutions');
    expect(result.solutions).toEqual([]);
    expect(result.successStories).toBeUndefined();
    expect(result.features).toBeUndefined();
    expect(result.seo).toBeUndefined();
  });

  it('should handle solution list page without case histories', () => {
    const result = makeSolutionListPageProps(
      'it',
      solutionListPageWithoutCaseHistories()
    );
    expect(result.successStories).toBeUndefined();
    expect(result.solutions).toBeDefined();
    expect(result.features).toBeDefined();
  });

  it('should handle solution list page without features', () => {
    const result = makeSolutionListPageProps(
      'it',
      solutionListPageWithoutFeatures()
    );
    expect(result.features).toBeUndefined();
    expect(result.successStories).toBeDefined();
    expect(result.solutions).toBeDefined();
  });

  it('should handle solution list page without solutions', () => {
    const result = makeSolutionListPageProps(
      'it',
      solutionListPageWithoutSolutions()
    );
    expect(result.solutions).toEqual([]);
    expect(result.successStories).toBeDefined();
    expect(result.features).toBeDefined();
  });

  it('should correctly map solution tags from products', () => {
    const result = makeSolutionListPageProps(
      'it',
      _.cloneDeep(strapiSolutionListPage)
    );
    expect(result.solutions[0].labels).toEqual([
      {
        label: 'P1',
        path: '/it/product-1',
      },
    ]);
  });

  it('should correctly build solution slug path', () => {
    const result = makeSolutionListPageProps(
      'it',
      _.cloneDeep(strapiSolutionListPage)
    );
    expect(result.solutions[0].slug).toBe('solutions/solution-1');
  });

  it('should skip solutions with missing slug and log error', () => {
    const result = makeSolutionListPageProps(
      'it',
      solutionListPageWithMissingSolutionSlug()
    );
    expect(result.solutions).toHaveLength(1);
    expect(result.solutions[0].name).toBe('Valid Solution');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Solution with title "Solution Without Slug": missing slug. Skipping...'
    );
  });

  it('should skip case histories with missing slug and log error', () => {
    const result = makeSolutionListPageProps(
      'it',
      solutionListPageWithMissingCaseHistorySlug()
    );
    expect(result.successStories?.stories).toHaveLength(1);
    expect(result.successStories?.stories[0].title).toBe('Valid Case History');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing CaseHistory with title "Case History Without Slug": missing slug. Skipping...'
    );
  });
});
