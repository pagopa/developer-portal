import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { document } from './markdoc/schema/document';
import { heading } from './markdoc/schema/heading';
import { parseAst } from './parseContent';
import { headingLevelsToShowInMenu } from 'nextjs-website/src/config';
import { includes } from 'lodash';

export type ParseInPageMenuConfig = {
  readonly assetsPrefix: string;
  readonly pagePath: string;
};

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
      type === 'heading' &&
      includes(headingLevelsToShowInMenu, attributes.level)
  );
  return Markdoc.transform(ast, { ...schema, variables: config });
};
