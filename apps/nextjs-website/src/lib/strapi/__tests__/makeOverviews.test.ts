import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import {
  overviewPageProps,
  strapiOverviews,
} from '@/lib/strapi/__tests__/fixtures/overviews';
import _ from 'lodash';
import { minimalDataSingleOverview } from '@/lib/strapi/__tests__/factories/overviews';

describe('makeOverviewsProps', () => {
  it('should transform strapi overviews to overview page props', () => {
    const result = makeOverviewsProps(_.cloneDeep(strapiOverviews));

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(overviewPageProps);
  });

  it('should handle minimal data with null optional fields', () => {
    const result = makeOverviewsProps(_.cloneDeep(minimalDataSingleOverview()));

    expect(result).toHaveLength(1);
    expect(result[0].feature).toBeUndefined();
    expect(result[0].startInfo).toBeUndefined();
    expect(result[0].tutorials).toBeUndefined();
    expect(result[0].postIntegration).toBeUndefined();
    expect(result[0].relatedLinks).toBeUndefined();
    expect(result[0].whatsNew).toBeUndefined();
    expect(result[0].seo).toBeUndefined();
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
});
