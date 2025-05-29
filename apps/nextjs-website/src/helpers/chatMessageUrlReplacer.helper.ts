import Markdoc, {
  ConfigType,
  Node,
  RenderableTreeNode,
} from '@markdoc/markdoc';
import { parseAst } from 'gitbook-docs/parseContent';
import { UrlReplaceMap } from '@/lib/strapi/makeProps/makeUrlReplaceMap';

export function transformAndReplaceUrlInMessage(
  markdown: string,
  config?: ConfigType,
  urlReplaceMap?: UrlReplaceMap
): RenderableTreeNode {
  //const p = parseContent(markdown, bodyConfig).flat()[0];
  // eslint-disable-next-line functional/no-expression-statements
  //console.log('parsed', parsed);

  const re = RegExp(
    'https?:\\/\\/(?:www\\.)?[a-zA-Z0-9\\-._~%]+(?:\\.[a-zA-Z]{2,})(?:[\\/?#][^\\s)]*)?'
  );
  // eslint-disable-next-line functional/no-let
  let updatedMarkdown = markdown;
  const matches = re.exec(markdown);
  // eslint-disable-next-line functional/no-expression-statements
  matches?.forEach((match) => {
    // eslint-disable-next-line functional/no-expression-statements
    if (urlReplaceMap) {
      const found = urlReplaceMap[match];
      // eslint-disable-next-line functional/no-expression-statements
      if (found && found.length > 0) {
        // eslint-disable-next-line functional/no-expression-statements,no-param-reassign
        updatedMarkdown = updatedMarkdown.replace(match, found);
      }
    }
  });
  const ast = parseAst(updatedMarkdown);
  // eslint-disable-next-line functional/no-expression-statements
  return Markdoc.transform(ast, config);
}
