import { mapWebinarsProps } from '@/lib/webinars/mapper';
import type { StrapiWebinars } from '@/lib/webinars/strapiTypes';
import _ from 'lodash';
import {
  strapiWebinars,
  webinarProps,
} from '@/lib/webinars/__tests__/fixtures';
import { spyOnConsoleError } from '@/lib/__tests__/spyOnConsole';
import { wrapAsPaginatedRootEntity } from '@/lib/__tests__/strapiEntityWrappers';
import { webinarsWithoutSlugAndTitle } from './factories';

describe('mapWebinarsProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi webinars to webinars props', () => {
    const result = mapWebinarsProps(_.cloneDeep(strapiWebinars));

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(webinarProps);
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiWebinars = wrapAsPaginatedRootEntity([]);

    const result = mapWebinarsProps(emptyData);

    expect(result).toHaveLength(0);
  });

  it('should handle corrupted data with try/catch and log error', () => {
    const result = mapWebinarsProps(webinarsWithoutSlugAndTitle());

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Webinar: missing title or slug. Title: undefined | Slug: undefined. Skipping...'
    );
  });
});
