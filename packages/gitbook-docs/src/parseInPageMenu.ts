import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { document } from './markdoc/schema/document';
import { heading } from './markdoc/schema/heading';
import { parseAst } from './parseContent';

export type ParseInPageMenuConfig = {
  readonly assetsPrefix: string;
  readonly pagePath: string;
};

// Array that defines the header level for which to show component in the in-page menu
const HEADING_LEVELS_TO_SHOW = [2];

const schema: ConfigType = {
  nodes: {
    document,
    heading: heading(),
  },
};

export const parseInPageMenu = (
  markdown: string,
  config: ParseInPageMenuConfig
): ReadonlyArray<RenderableTreeNode> => {
  const ast = Array.from(parseAst(markdown).walk()).filter(
    ({ type, attributes }) =>
      type === 'heading' && HEADING_LEVELS_TO_SHOW.includes(attributes.level)
  );
  return Markdoc.transform(ast, { ...schema, variables: config });
};
