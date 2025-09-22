import { makeCaseHistories } from '@/lib/strapi/makeProps/makeCaseHistories';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import _ from 'lodash';
import {
  caseHistoriesPageTemplateProps,
  strapiCaseHistories,
} from '@/lib/strapi/__tests__/fixtures/caseHistories';
import {
  minimalDataCaseHistories,
  caseHistoriesWithMultipleProducts,
  caseHistoriesWithoutImage,
} from '@/lib/strapi/__tests__/factories/caseHistories';
import { mediaJpeg } from './factories/media';

describe('makeCaseHistoriesProps', () => {
  it('should transform strapi case histories to case history props', () => {
    const result = makeCaseHistories(_.cloneDeep(strapiCaseHistories));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(caseHistoriesPageTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeCaseHistories(
      _.cloneDeep(minimalDataCaseHistories())
    );
    const firstElement = result[0];
    expect(result).toHaveLength(1);
    expect(firstElement.description).toBeUndefined();
    expect(firstElement.image).toBeUndefined();
    expect(firstElement.seo).toBeUndefined();
    expect(firstElement.parts).toEqual([]);
    expect(firstElement.products).toBeDefined();
    expect(firstElement.updatedAt).toBe('2023-01-02T00:00:00.000Z');
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiCaseHistories = {
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
    const result = makeCaseHistories(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should handle case history with multiple products', () => {
    const result = makeCaseHistories(caseHistoriesWithMultipleProducts());
    const firstElement = result[0];
    expect(firstElement.products).toHaveLength(2);
    expect(firstElement.products[1]).toMatchObject({
      name: 'Second Product',
      slug: 'second-product',
      logo: mediaJpeg().attributes,
    });
  });

  it('should handle case history without image', () => {
    const result = makeCaseHistories(caseHistoriesWithoutImage());
    expect(result[0].image).toBeUndefined();
  });
});
