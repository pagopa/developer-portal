import React, { ReactNode } from 'react';
import { parseInPageMenu } from 'gitbook-docs/parseInPageMenu';
import {
  RenderingComponents,
  renderInPageMenu,
} from 'gitbook-docs/renderInPageMenu';
import Heading from '@/components/organisms/GuideInPageMenu/components/Heading';

type GuideInPageMenuProps = {
  assetsPrefix: string;
  pagePath: string;
  inPageMenu: string;
};

const components: RenderingComponents<ReactNode> = {
  Heading: Heading,
};

const GuideInPageMenu = ({
  inPageMenu,
  assetsPrefix,
  pagePath,
}: GuideInPageMenuProps) => {
  const nodes = parseInPageMenu(inPageMenu, { assetsPrefix, pagePath });

  return nodes.length ? renderInPageMenu(nodes, React, components) : null;
};

export default GuideInPageMenu;
