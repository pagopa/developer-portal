import { makeWebinarsProps } from '@/lib/strapi/makeProps/makeWebinars';
import { StrapiWebinars } from '@/lib/strapi/types/webinars';
import _ from 'lodash';
import {
  strapiWebinars,
  strapiWebinarsWithMissingData,
  webinarProps,
} from './fixtures/webinars';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';

describe('makeWebinarsProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi webinars to webinars props', () => {
    const result = makeWebinarsProps(_.cloneDeep({ data: strapiWebinars }));
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(webinarProps);
  });

  it('should handle a payload with two object with the second one with missing data and successfully return webinar props with only one item', () => {
    const result = makeWebinarsProps(
      _.cloneDeep({ data: strapiWebinarsWithMissingData })
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(webinarProps);
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiWebinars = {
      ...[],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    };
    const result = makeWebinarsProps({ data: emptyData });
    expect(result).toHaveLength(0);
  });

  it('should handle corrupted data with try/catch and log error', () => {
    const corruptedData: StrapiWebinars = {
      ...[
        {
          ...strapiWebinars[0],
          id: 1,
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    };

    const result = makeWebinarsProps({ data: corruptedData });

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Webinar: missing title or slug. Title: undefined | Slug: undefined. Skipping...'
    );
  });
});
