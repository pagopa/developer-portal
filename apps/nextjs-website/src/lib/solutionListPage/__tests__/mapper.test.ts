import { mapSolutionListPageProps } from '@/lib/solutionListPage/mapper';
import {
  expectedSolutionListTemplateProps,
  strapiSolutionListPage,
} from '@/lib/solutionListPage/__tests__/fixtures';
import {
  minimalDataSolutionListPage,
  solutionListPageWithMissingCaseHistorySlug,
  solutionListPageWithMissingSolutionSlug,
  solutionListPageWithoutCaseHistories,
  solutionListPageWithoutFeatures,
  solutionListPageWithoutSolutions,
} from '@/lib/solutionListPage/__tests__/factories';
import { spyOnConsoleError } from '@/lib/__tests__/spyOnConsole';
import { cloneDeep } from 'lodash';

describe('mapSolutionListPageProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi solution list page to solution list template props', () => {
    const result = mapSolutionListPageProps(
      'it',
      cloneDeep({ data: strapiSolutionListPage })
    );

    expect(result).toMatchObject(expectedSolutionListTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = mapSolutionListPageProps('it', {
      data: minimalDataSolutionListPage(),
    });

    expect(result).not.toBeNull();
    expect(result.hero.title).toBe('Minimal Solutions');
    expect(result.solutions).toEqual([]);
    expect(result.successStories).toBeUndefined();
    expect(result.features).toBeUndefined();
    expect(result.seo).toBeUndefined();
  });

  it('should handle solution list page without case histories', () => {
    const result = mapSolutionListPageProps('it', {
      data: solutionListPageWithoutCaseHistories(),
    });

    expect(result.successStories).toBeUndefined();
    expect(result.solutions).toBeDefined();
    expect(result.features).toBeDefined();
  });

  it('should handle solution list page without features', () => {
    const result = mapSolutionListPageProps('it', {
      data: solutionListPageWithoutFeatures(),
    });

    expect(result.features).toBeUndefined();
    expect(result.successStories).toBeDefined();
    expect(result.solutions).toBeDefined();
  });

  it('should handle solution list page without solutions', () => {
    const result = mapSolutionListPageProps('it', {
      data: solutionListPageWithoutSolutions(),
    });

    expect(result.solutions).toEqual([]);
    expect(result.successStories).toBeDefined();
    expect(result.features).toBeDefined();
  });

  it('should skip solutions with missing slug', () => {
    const result = mapSolutionListPageProps('it', {
      data: solutionListPageWithMissingSolutionSlug(),
    });

    expect(result.solutions).toHaveLength(1);
    expect(result.solutions[0].name).toBe('Valid Solution');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Solution with title "Solution Without Slug": missing slug. Skipping...'
    );
  });

  it('should skip case histories with missing slug', () => {
    const result = mapSolutionListPageProps('it', {
      data: solutionListPageWithMissingCaseHistorySlug(),
    });

    expect(result.successStories?.stories).toHaveLength(1);
    expect(result.successStories?.stories[0].title).toBe('Valid Case History');
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing CaseHistory with title "Case History Without Slug": missing slug. Skipping...'
    );
  });

  it('should correctly map solution tags from products', () => {
    const result = mapSolutionListPageProps(
      'it',
      cloneDeep({ data: strapiSolutionListPage })
    );

    expect(result.solutions[0].labels).toEqual([
      {
        label: 'P1',
        path: '/it/product-1',
      },
    ]);
  });

  it('should correctly build solution slug path', () => {
    const result = mapSolutionListPageProps(
      'it',
      cloneDeep({ data: strapiSolutionListPage })
    );

    expect(result.solutions[0].slug).toBe('solutions/solution-1');
  });
});
