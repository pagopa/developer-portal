import { makeQuickStartGuidesProps } from '@/lib/strapi/makeProps/makeQuickStartGuides';
import { strapiQuickStartGuides } from './fixtures/quickStartGuides';
import {
  minimalQuickStartGuides,
  emptyQuickStartGuides,
  quickStartGuidesWithMissingProductSlug,
} from './factories/quickStartGuides';
import { spyOnConsoleError } from './spyOnConsole';
import { cloneDeep } from 'lodash';

describe('makeQuickStartGuidesProps', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi quick start guides to page props', () => {
    const result = makeQuickStartGuidesProps(
      'it',
      cloneDeep(strapiQuickStartGuides)
    );
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.abstract?.title).toBe('Quick Start Guide Title');
    expect(firstElement.steps).toHaveLength(1);
    expect(firstElement.steps?.[0].title).toBe('Step 1');
    expect(firstElement.steps?.[0].parts).toHaveLength(2);
    expect(firstElement.steps?.[0].parts[0].component).toBe('alert');
    expect(firstElement.steps?.[0].parts[1].component).toBe('codeBlock');
    expect(firstElement.seo).toMatchObject({
      metaTitle: 'Meta Title',
      metaDescription: 'Meta Description',
    });
  });

  it('should handle minimal quick start guides', () => {
    const result = makeQuickStartGuidesProps('it', minimalQuickStartGuides());
    expect(result).toHaveLength(1);
    const firstElement = result[0];
    expect(firstElement.abstract?.title).toBe('Minimal Quick Start');
    expect(firstElement.steps).toHaveLength(1);
    expect(firstElement.steps?.[0].title).toBe('Minimal Step');
    expect(firstElement.steps?.[0].parts).toHaveLength(1);
    expect(firstElement.steps?.[0].parts[0].component).toBe('alert');
    expect(firstElement.seo).toBeUndefined();
  });

  it('should handle empty quick start guides', () => {
    const result = makeQuickStartGuidesProps('it', emptyQuickStartGuides());
    expect(result).toHaveLength(0);
  });

  it('should handle quick start guides with missing product slug', () => {
    const result = makeQuickStartGuidesProps(
      'it',
      quickStartGuidesWithMissingProductSlug()
    );
    expect(result).toHaveLength(0);
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      'Error while processing QuickStartGuide with id 1: missing product slug. Skipping...'
    );
  });
});
