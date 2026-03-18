import { makeWebinarsProps } from '@/lib/strapi/makeProps/makeWebinars';
import { strapiWebinars, webinarProps } from './fixtures/webinars';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';
import { wrapAsPaginatedRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

describe('makeWebinarsProps', () => {
  afterEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi webinars to webinars props', () => {
    const result = makeWebinarsProps(strapiWebinars);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(webinarProps);
  });

  it('should handle empty data array', () => {
    const result = makeWebinarsProps(wrapAsPaginatedRootEntity([]));
    expect(result).toHaveLength(0);
  });

  it('should handle corrupted data with try/catch and log error', () => {
    const corruptedData = wrapAsPaginatedRootEntity([
      {
        ...strapiWebinars.data[0],
        title: undefined as any,
        slug: undefined as any,
      },
    ]);

    const result = makeWebinarsProps(corruptedData);

    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing Webinar: missing title or slug. Title: undefined | Slug: undefined. Skipping...'
    );
  });
});
