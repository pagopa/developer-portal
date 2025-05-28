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
    'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)'
  );
  const matches = re.exec(markdown);
  // eslint-disable-next-line functional/no-expression-statements
  matches?.forEach((match) => {
    if (urlReplaceMap) {
      const found = urlReplaceMap[match];
      if (found && found.length > 0) {
        // eslint-disable-next-line functional/no-expression-statements,no-param-reassign
        markdown = markdown.replace(found[0], markdown);
      }
    }
  });
  const ast = parseAst(markdown);
  // eslint-disable-next-line functional/no-expression-statements
  return Markdoc.transform(ast, config);
}
