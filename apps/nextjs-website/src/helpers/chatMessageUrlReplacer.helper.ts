import Markdoc, {
  ConfigType,
  Node,
  RenderableTreeNode,
} from '@markdoc/markdoc';
import { parseContent } from 'gitbook-docs/parseContent';
import { UrlReplaceMap } from '@/lib/strapi/makeProps/makeUrlReplaceMap';
import { hint } from 'gitbook-docs/markdoc/schema/hint';
import { parseAst } from 'gitbook-docs/parseContent';

export function transformAndReplaceUrlInMessage(
  markdown: string,
  config?: ConfigType
): RenderableTreeNode {
  //const p = parseContent(markdown, bodyConfig).flat()[0];
  // eslint-disable-next-line functional/no-expression-statements
  //console.log('parsed', parsed);
  const ast = parseAst(markdown);
  // eslint-disable-next-line functional/no-expression-statements
  return Markdoc.transform(ast, config);
}
