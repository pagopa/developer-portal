import type { CustomMessagesMap } from '@/lib/strapi/types/customMessagesMap';
import type { CustomMessages } from '@/lib/types/customMessages';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

const translationDisclaimerMessage: BlocksContent = [
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'This guide is a translated version of the original content.',
      },
    ],
  },
];

const guideAlertMessage: BlocksContent = [
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Check the integration notes before going live.',
      },
    ],
  },
];

export const strapiCustomMessagesMap: CustomMessagesMap = {
  data: {
    customMessages: [
      {
        key: 'guides.translationDisclaimer',
        value: translationDisclaimerMessage,
      },
      {
        key: 'guides.goLiveAlert',
        value: guideAlertMessage,
      },
    ],
  },
};

export const expectedCustomMessagesMap: CustomMessages = new Map([
  ['guides.translationDisclaimer', translationDisclaimerMessage],
  ['guides.goLiveAlert', guideAlertMessage],
]);

export const duplicateTranslationDisclaimerMessage: BlocksContent = [
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Use the latest translated disclaimer content.',
      },
    ],
  },
];
