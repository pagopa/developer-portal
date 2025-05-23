import Markdoc, {
  ConfigType,
  Node,
  RenderableTreeNode,
} from '@markdoc/markdoc';

export function transformAndReplaceUrlInMessage(
  ast: Node,
  config?: ConfigType
): RenderableTreeNode {
  // eslint-disable-next-line functional/no-expression-statements
  console.log('ast: ', ast);
  return Markdoc.transform(ast, config);
}
