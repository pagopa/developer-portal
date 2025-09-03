import { makeSolutionListPage } from '@/lib/strapi/makeProps/makeSolutionListPage';
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
} from '@/lib/strapi/__tests__/factories/solutionListPage';

describe('makeSolutionListPage', () => {
  it('should transform strapi solution list page to solution list template props', () => {
    const result = makeSolutionListPage(_.cloneDeep(strapiSolutionListPage));
    expect(result).toMatchObject(expectedSolutionListTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeSolutionListPage(minimalDataSolutionListPage());
    expect(result.hero.title).toBe('Minimal Solutions');
    expect(result.hero.subtitle).toBe('Minimal solutions page');
    expect(result.solutions).toEqual([]);
    expect(result.successStories).toBeUndefined();
    expect(result.features).toBeUndefined();
    expect(result.seo).toBeUndefined();
  });

  it('should handle solution list page without case histories', () => {
    const result = makeSolutionListPage(solutionListPageWithoutCaseHistories());
    expect(result.successStories).toBeUndefined();
    expect(result.solutions).toBeDefined();
    expect(result.features).toBeDefined();
  });

  it('should handle solution list page without features', () => {
    const result = makeSolutionListPage(solutionListPageWithoutFeatures());
    expect(result.features).toBeUndefined();
    expect(result.successStories).toBeDefined();
    expect(result.solutions).toBeDefined();
  });

  it('should handle solution list page without solutions', () => {
    const result = makeSolutionListPage(solutionListPageWithoutSolutions());
    expect(result.solutions).toEqual([]);
    expect(result.successStories).toBeDefined();
    expect(result.features).toBeDefined();
  });

  it('should correctly map solution tags from products', () => {
    const result = makeSolutionListPage(_.cloneDeep(strapiSolutionListPage));
    expect(result.solutions[0].tags).toEqual([
      {
        label: 'P1',
        path: '/product-1',
      },
    ]);
  });

  it('should correctly build solution slug path', () => {
    const result = makeSolutionListPage(_.cloneDeep(strapiSolutionListPage));
    expect(result.solutions[0].slug).toBe('solutions/solution-1');
  });
});
