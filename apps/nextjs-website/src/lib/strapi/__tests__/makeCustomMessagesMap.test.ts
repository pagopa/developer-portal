import {
  emptyCustomMessagesMap,
  customMessagesMapWithDuplicateKeys,
  customMessagesMapWithoutAttributes,
  customMessagesMapWithoutCustomMessages,
  customMessagesMapWithoutData,
} from '@/lib/strapi/__tests__/factories/customMessagesMap';
import {
  duplicateTranslationDisclaimerMessage,
  expectedCustomMessagesMap,
  strapiCustomMessagesMap,
} from '@/lib/strapi/__tests__/fixtures/customMessagesMap';
import { spyOnConsoleError } from '@/lib/strapi/__tests__/spyOnConsole';
import { makeCustomMessagesMap } from '@/lib/strapi/makeProps/makeCustomMessagesMap';
import _ from 'lodash';

describe('makeCustomMessagesMap', () => {
  beforeEach(() => {
    spyOnConsoleError.mockClear();
  });

  afterAll(() => {
    spyOnConsoleError.mockRestore();
  });

  it('should transform strapi custom messages to a custom messages map', () => {
    const result = makeCustomMessagesMap(_.cloneDeep(strapiCustomMessagesMap));

    expect(result).toEqual(expectedCustomMessagesMap);
  });

  it('should return an empty map when custom messages are empty', () => {
    const result = makeCustomMessagesMap(emptyCustomMessagesMap());

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).not.toHaveBeenCalled();
  });

  it('should return an empty map when data is missing', () => {
    const result = makeCustomMessagesMap(customMessagesMapWithoutData());

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing Custom Messages Map: missing data or attributes. Returning an empty map...'
      )
    );
  });

  it('should return an empty map when attributes are missing', () => {
    const result = makeCustomMessagesMap(customMessagesMapWithoutAttributes());

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error while processing Custom Messages Map: missing data or attributes. Returning an empty map...'
      )
    );
  });

  it('should return an empty map when customMessages is undefined', () => {
    const result = makeCustomMessagesMap(
      customMessagesMapWithoutCustomMessages()
    );

    expect(result).toEqual(new Map());
    expect(spyOnConsoleError).not.toHaveBeenCalled();
  });

  it('should keep the last value when duplicate keys are present', () => {
    const result = makeCustomMessagesMap(customMessagesMapWithDuplicateKeys());

    expect(result.size).toBe(2);
    expect(result.get('guides.translationDisclaimer')).toEqual(
      duplicateTranslationDisclaimerMessage
    );
  });
});
