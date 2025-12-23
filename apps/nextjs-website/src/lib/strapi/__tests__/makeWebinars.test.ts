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

  it('should handle corrupted data with try/catch and log error', () => {
    const corruptedData: StrapiWebinars = {
      data: [
        {
          id: 1,
          attributes: {
            // Missing required coverImage field to trigger error
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
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

    const result = makeWebinarsProps(corruptedData);

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Webinar: missing title or slug. Title: undefined | Slug: undefined. Skipping...'
    );
  });
});
