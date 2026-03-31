import type {
  CustomMessage,
  CustomMessagesMap,
} from '@/lib/strapi/types/customMessagesMap';
import { CustomMessages } from '@/lib/types/customMessages';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export function makeCustomMessagesMap(
  customMessagesMap: CustomMessagesMap
): CustomMessages {
  const customMessagesMapEntries =
    customMessagesMap.data.attributes.customMessages.map(
      (customMessage: CustomMessage) =>
        [customMessage.key, customMessage.value] as const
    );

  return new Map<string, BlocksContent>(customMessagesMapEntries);
}
