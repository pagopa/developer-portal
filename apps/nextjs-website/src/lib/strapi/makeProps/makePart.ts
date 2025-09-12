import { Part } from '@/lib/types/part';
import { parseCkEditorContent } from '@/helpers/parseCkEditorContent.helpers';
import { StrapiPart } from '@/lib/strapi/types/part';

export function makePartProps(strapiPart: StrapiPart): Part | null {
  switch (strapiPart.__component) {
    case 'parts.alert':
      return {
        component: 'alert',
        ...strapiPart,
      };
    case 'parts.api-tester':
      return {
        component: 'apiTester',
        apiRequest: {
          ...strapiPart.requestCode,
          description: strapiPart.requestDescription,
          attributes: [...strapiPart.requestAttributes],
        },
        apiResponse: {
          ...strapiPart.responseCode,
          description: strapiPart.responseDescription,
        },
      };
    case 'parts.code-block':
      return {
        component: 'codeBlock',
        ...strapiPart,
      };
    case 'parts.html':
      return {
        component: 'blockRenderer',
        ...strapiPart,
      };
    case 'parts.embed-html':
      return {
        component: 'innerHTMLLazyLoaded',
        ...strapiPart,
      };
    case 'parts.quote':
      return {
        component: 'quote',
        quote: strapiPart.text,
        backgroundImage: strapiPart.backgroundImage.data?.attributes,
      };
    case 'parts.ck-editor':
      // eslint-disable-next-line no-case-declarations
      const { parsedContent, menuItems } = parseCkEditorContent(
        strapiPart.content
      );
      return {
        component: 'ckEditor',
        content: parsedContent,
        menuItems: [...menuItems],
      };
    case 'parts.ck-editor-html':
      // eslint-disable-next-line no-case-declarations
      // eslint-disable-next-line no-case-declarations
      const parsedHtmlContent = parseCkEditorContent(strapiPart.content);
      return {
        component: 'ckEditor',
        content: parsedHtmlContent.parsedContent,
        menuItems: [...parsedHtmlContent.menuItems],
      };
    default:
      return null;
  }
}
