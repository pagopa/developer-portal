import type {
  CustomMessage,
  CustomMessagesMap,
} from '@/lib/strapi/types/customMessagesMap';
import type { CustomMessages } from '@/lib/types/customMessages';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

export function makeCustomMessagesMap(
  customMessagesMap: CustomMessagesMap
): CustomMessages {
  if (!customMessagesMap.data) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `Error while processing Custom Messages Map: missing data or attributes. Returning an empty map...`
    );
    return new Map<string, BlocksContent>();
  }
  const customMessages = customMessagesMap.data.customMessages ?? [];

  const customMessagesMapEntries = customMessages.map(
    (customMessage: CustomMessage) =>
      [customMessage.key, customMessage.value] as const
  );

  return new Map<string, BlocksContent>(customMessagesMapEntries);
}
