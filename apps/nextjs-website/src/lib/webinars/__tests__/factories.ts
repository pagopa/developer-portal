import { wrapAsPaginatedRootEntity } from '../../__tests__/strapiEntityWrappers';
import type { StrapiWebinars } from '../strapiTypes';
import { strapiWebinars } from './fixtures';

export function webinarsWithoutSlugAndTitle(): StrapiWebinars {
  return wrapAsPaginatedRootEntity([
    {
      ...strapiWebinars.data[0],
      title: undefined as unknown as string,
      slug: undefined as unknown as string,
    },
  ]);
}
