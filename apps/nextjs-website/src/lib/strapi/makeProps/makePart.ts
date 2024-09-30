import { Part } from '@/lib/types/part';
import { parseCkEditorContent } from '@/helpers/parseCkEditorContent.helpers';
import { StrapiPart } from '@/lib/strapi/codecs/PartCodec';

export function makePartProps(part: StrapiPart): Part | null {
  switch (part.__component) {
    case 'parts.alert':
      return {
        component: 'alert',
        ...part,
      };
    case 'parts.api-tester':
      return {
        component: 'apiTester',
        apiRequest: {
          ...part.requestCode,
          description: part.requestDescription,
          attributes: part.requestAttributes,
        },
        apiResponse: {
          ...part.responseCode,
          description: part.responseDescription,
        },
      };
    case 'parts.code-block':
      return {
        component: 'codeBlock',
        ...part,
      };
    case 'parts.html':
      return {
        component: 'blockRenderer',
        ...part,
      };
    case 'parts.embed-html':
      return {
        component: 'innerHTMLLazyLoaded',
        ...part,
      };
    case 'parts.quote':
      return {
        component: 'quote',
        quote: part.text,
        backgroundImage: part.backgroundImage.data?.attributes,
      };
    case 'parts.ck-editor':
      // eslint-disable-next-line no-case-declarations
      const { parsedContent, menuItems } = parseCkEditorContent(part.content);
      return {
        component: 'ckEditor',
        content: parsedContent,
        menuItems: [...menuItems],
      };
    default:
      return null;
  }
}
