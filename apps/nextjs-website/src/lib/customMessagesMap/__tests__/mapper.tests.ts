import {
  emptyCustomMessagesMap,
  customMessagesMapWithDuplicateKeys,
  customMessagesMapWithoutAttributes,
  customMessagesMapWithoutCustomMessages,
  customMessagesMapWithoutData,
} from '@/lib/customMessagesMap/__tests__/factories';
import {
  duplicateTranslationDisclaimerMessage,
  expectedCustomMessagesMap,
  strapiCustomMessagesMap,
} from '@/lib/customMessagesMap/__tests__/fixtures';
import { mapCustomMessagesMap } from '@/lib/customMessagesMap/mapper';
import { spyOnConsoleError } from '@/lib/__tests__/spyOnConsole';
import { cloneDeep } from 'lodash';

describe('makeCustomMessagesMap', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi custom messages to a custom messages map', () => {
    const result = mapCustomMessagesMap(cloneDeep(strapiCustomMessagesMap));

    expect(result).toEqual(expectedCustomMessagesMap);
  });

  it('should return an empty map when custom messages are empty', () => {
    const result = mapCustomMessagesMap(emptyCustomMessagesMap());

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).not.toHaveBeenCalled();
  });

  it('should return an empty map when data is missing', () => {
    const result = mapCustomMessagesMap(customMessagesMapWithoutData());

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing Custom Messages Map: missing data or attributes. Returning an empty map...'
      )
    );
  });

  it('should return an empty map when attributes are missing', () => {
    const result = mapCustomMessagesMap(customMessagesMapWithoutAttributes());

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing Custom Messages Map: missing data or attributes. Returning an empty map...'
      )
    );
  });

  it('should return an empty map when customMessages is undefined', () => {
    const result = mapCustomMessagesMap(
      customMessagesMapWithoutCustomMessages()
    );

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).not.toHaveBeenCalled();
  });

  it('should keep the last value when duplicate keys are present', () => {
    const result = mapCustomMessagesMap(customMessagesMapWithDuplicateKeys());

    expect(result.size).toBe(2);
    expect(result.get('guides.translationDisclaimer')).toEqual(
      duplicateTranslationDisclaimerMessage
    );
  });
});
