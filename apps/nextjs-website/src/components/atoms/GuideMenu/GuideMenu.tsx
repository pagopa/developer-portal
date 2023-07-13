import Markdoc from '@markdoc/markdoc';
import { parseMenu } from 'gitbook-docs/parseMenu';

import React, { ReactNode } from 'react';

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
};

type AProps = {
  href: string;
  title?: string;
  children: ReactNode;
};

type ItemProps = {
  children: ReactNode;
};

type ListProps = {
  children: ReactNode;
};

const components = {
  Link: ({ href, children }: AProps) => <a href={href}>{children}</a>,
  Item: ({ children }: ItemProps) => <li>{children}</li>,
  List: ({ children }: ListProps) => <ul>{children}</ul>,
};

const GuideMenu = ({ menu, assetsPrefix, linkPrefix }: GuideMenuProps) => (
  <>
    {Markdoc.renderers.react(
      parseMenu(menu, { assetsPrefix, linkPrefix }),
      React,
      { components }
    )}
  </>
);

export default GuideMenu;
