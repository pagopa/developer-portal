import Markdoc, {
  ConfigType,
  Node,
  RenderableTreeNode,
} from '@markdoc/markdoc';
import { parseContent } from 'gitbook-docs/parseContent';
import { UrlReplaceMap } from '@/lib/strapi/makeProps/makeUrlReplaceMap';

export function transformAndReplaceUrlInMessage(
  markdown: string,
  urlReplaceMap: UrlReplaceMap,
  config?: ConfigType
): RenderableTreeNode {
  const bodyConfig = {
    urlReplaces: urlReplaceMap,
    assetsPrefix: '',
    pagePath: '',
    isPageIndex: false,
    gitBookPagesWithTitle: [],
    spaceToPrefix: [],
  };

  return parseContent(markdown, bodyConfig).flat()[0];
  // eslint-disable-next-line functional/no-expression-statements
  //console.log('parsed', parsed);
  //const ast = Markdoc.parse(markdown);
  // eslint-disable-next-line functional/no-expression-statements
  //return Markdoc.transform(ast, { ...config, variables: bodyConfig });
}
