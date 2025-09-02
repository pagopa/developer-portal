import { makeCaseHistoriesProps } from '@/lib/strapi/makeProps/makeCaseHistories';
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
    const result = makeCaseHistoriesProps(_.cloneDeep(strapiCaseHistories));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(caseHistoriesPageTemplateProps);
  });

  it('should handle minimal data with missing optional fields', () => {
    const result = makeCaseHistoriesProps(
      _.cloneDeep(minimalDataCaseHistories())
    );
    expect(result).toHaveLength(1);
    expect(result[0].description).toBeUndefined();
    expect(result[0].image).toBeUndefined();
    expect(result[0].seo).toBeUndefined();
    expect(result[0].parts).toEqual([]);
    expect(result[0].products).toBeDefined();
    expect(result[0].updatedAt).toBe('2023-01-02T00:00:00.000Z');
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
    const result = makeCaseHistoriesProps(emptyData);
    expect(result).toHaveLength(0);
  });

  it('should handle case history with multiple products', () => {
    const result = makeCaseHistoriesProps(caseHistoriesWithMultipleProducts());
    expect(result[0].products).toHaveLength(2);
    expect(result[0].products[1]).toMatchObject({
      name: 'Second Product',
      slug: 'second-product',
      logo: mediaJpeg().attributes,
    });
  });

  it('should handle case history without image', () => {
    const result = makeCaseHistoriesProps(caseHistoriesWithoutImage());
    expect(result[0].image).toBeUndefined();
  });
});
