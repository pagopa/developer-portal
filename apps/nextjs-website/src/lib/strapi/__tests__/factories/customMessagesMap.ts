/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CustomMessagesMap } from '@/lib/strapi/types/customMessagesMap';
import {
  duplicateTranslationDisclaimerMessage,
  strapiCustomMessagesMap,
} from '../fixtures/customMessagesMap';

export function emptyCustomMessagesMap(): CustomMessagesMap {
  return {
    data: {
      attributes: {
        customMessages: [],
      },
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
    data: {
      attributes: undefined as any,
    },
  };
}

export function customMessagesMapWithoutCustomMessages(): CustomMessagesMap {
  return {
    data: {
      attributes: {
        customMessages: undefined as any,
      },
    },
  };
}

export function customMessagesMapWithDuplicateKeys(): CustomMessagesMap {
  return {
    data: {
      attributes: {
        customMessages: [
          ...strapiCustomMessagesMap.data.attributes.customMessages,
          {
            key: 'guides.translationDisclaimer',
            value: duplicateTranslationDisclaimerMessage,
          },
        ],
      },
    },
  };
}
