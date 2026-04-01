/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CustomMessagesMap } from '@/lib/strapi/types/customMessagesMap';
import {
  duplicateTranslationDisclaimerMessage,
  strapiCustomMessagesMap,
} from '../fixtures/customMessagesMap';

export function emptyCustomMessagesMap(): CustomMessagesMap {
  return {
    data: {
      customMessages: [],
    },
  };
}

export function customMessagesMapWithoutData(): CustomMessagesMap {
  return {
    data: undefined as any,
  };
}

export function customMessagesMapWithoutAttributes(): CustomMessagesMap {
  return {
    data: undefined as any,
  };
}

export function customMessagesMapWithoutCustomMessages(): CustomMessagesMap {
  return {
    data: {
      customMessages: undefined as any,
    },
  };
}

export function customMessagesMapWithDuplicateKeys(): CustomMessagesMap {
  return {
    data: {
      customMessages: [
        ...strapiCustomMessagesMap.data.customMessages,
        {
          key: 'guides.translationDisclaimer',
          value: duplicateTranslationDisclaimerMessage,
        },
      ],
    },
  };
}
