import { Part } from '@/lib/types/part';
import { parseCkEditorContent } from '@/helpers/parseCkEditorContent.helpers';
import { StrapiPart } from '@/lib/strapi/types/part';

export function makePartProps(
  strapiPart: StrapiPart,
  markdownContentDict?: Record<string, string>
): Part | null {
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
        backgroundImage: strapiPart.backgroundImage,
      };
    case 'parts.markdown':
      if (!markdownContentDict)
        return {
          component: 'markdown',
          content: '',
          dirName: '',
        };
      // eslint-disable-next-line no-case-declarations
      const content =
        markdownContentDict[`${strapiPart.dirName}/${strapiPart.pathToFile}`];
      return {
        component: 'markdown',
        content: content ? content : '',
        dirName: strapiPart.dirName,
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
    default:
      return null;
  }
}
