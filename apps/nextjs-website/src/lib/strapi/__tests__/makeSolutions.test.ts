import { makeSolutions } from '@/lib/strapi/makeProps/makeSolutions';
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
} from '@/lib/strapi/__tests__/factories/solutions';

describe('makeSolutions', () => {
  it('should transform strapi solutions to solution props', () => {
    const result = makeSolutions(_.cloneDeep(strapiSolutions));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(expectedSolutionTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeSolutions(_.cloneDeep(minimalDataSolutions()));
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
    const result = makeSolutions(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should handle solutions without case histories', () => {
    const result = makeSolutions(solutionsWithoutCaseHistories());
    expect(result[0].successStories).toBeUndefined();
  });

  it('should handle solutions without webinars', () => {
    const result = makeSolutions(solutionsWithoutWebinars());
    expect(result[0].webinars).toEqual([]);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeSolutions(_.cloneDeep(minimalDataSolutions()));
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
    const result = makeSolutions(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should handle solutions without case histories', () => {
    const result = makeSolutions(solutionsWithoutCaseHistories());
    expect(result[0].successStories).toBeUndefined();
  });

  it('should handle solutions without webinars', () => {
    const result = makeSolutions(solutionsWithoutWebinars());
    expect(result[0].webinars).toEqual([]);
  });
});
