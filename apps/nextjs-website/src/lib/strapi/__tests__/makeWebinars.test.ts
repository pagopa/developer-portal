import { makeWebinarsProps } from '@/lib/strapi/makeProps/makeWebinars';
import { StrapiWebinars } from '@/lib/strapi/types/webinars';
import _ from 'lodash';
import {
  strapiWebinars,
  strapiWebinarsWithMissingData,
  webinarProps,
} from './fixtures/webinars';

describe('makeWebinarsProps', () => {
  it('should transform strapi webinars to webinars props', () => {
    const result = makeWebinarsProps(_.cloneDeep(strapiWebinars));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(webinarProps);
  });

  it('should handle a payload with two object with the second one with missing data and successfully return webinar props with only one item', () => {
    const result = makeWebinarsProps(
      _.cloneDeep(strapiWebinarsWithMissingData)
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(webinarProps);
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiWebinars = {
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
    const result = makeWebinarsProps(emptyData);
    expect(result).toHaveLength(0);
  });
});
